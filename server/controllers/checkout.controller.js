import stripe from 'stripe'
import { Order } from '../models/order.model'
import Service from '../models/service.model'
import config from './../../config/config'

const myStripe = stripe(config.stripe_test_secret_key)

const ensureStripeConfigured = (res) => {
  // Template-safe behavior: make missing Stripe configuration a clear 503
  if (!config.stripe_test_secret_key) {
    res.status(503).json({ error: 'Stripe is not configured (missing STRIPE_TEST_SECRET_KEY / STRIPE_SECRET_KEY)' })
    return false
  }
  return true
}

/**
 * Create a payment intent and order
 */
const createPaymentIntent = async (req, res) => {
  try {
    if (!ensureStripeConfigured(res)) return

    const { serviceId, requirements, deliveryDeadline } = req.body

    if (!serviceId) {
      return res.status(400).json({ error: 'Service ID is required' })
    }

    // Verify service exists and has a valid price
    const service = await Service.findById(serviceId).populate('seller', '_id stripe_seller').exec()
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    const price = Number(service.price)
    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: 'Service price is invalid' })
    }

    // Create order in pending state first
    const order = new Order({
      service: service._id,
      buyer: req.auth._id,
      seller: service.seller._id,
      amount: price,
      requirements,
      deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline) : undefined,
      status: 'pending'
    })

    await order.save()

    // Determine if we can use Stripe Connect for automated payout
    const sellerStripeId = service.seller?.stripe_seller?.stripe_user_id
    const paymentIntentOptions = {
      amount: Math.round(price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        serviceId: service._id.toString(),
        buyerId: req.auth._id,
        sellerId: service.seller._id.toString()
      }
    }

    // If seller has connected their account, use destination charges
    // We take a 10% fee for the platform
    if (sellerStripeId) {
      const platformFee = Math.round(price * 100 * 0.10)
      paymentIntentOptions.transfer_data = {
        destination: sellerStripeId,
      }
      paymentIntentOptions.application_fee_amount = platformFee
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await myStripe.paymentIntents.create(paymentIntentOptions)

    order.paymentId = paymentIntent.id
    order.updated = Date.now()
    await order.save()

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return res.status(500).json({ error: 'Payment processing failed' })
  }
}

/**
 * Confirm payment and update order status
 */
const confirmPayment = async (req, res) => {
  try {
    if (!ensureStripeConfigured(res)) return

    const { paymentIntentId, orderId } = req.body

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ error: 'Payment intent ID and order ID are required' })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Buyer-only confirm (webhook should be the source of truth in production)
    if (order.buyer.toString() !== String(req.auth._id)) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    // Verify payment with Stripe
    const paymentIntent = await myStripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: `Payment not confirmed. Current status: ${paymentIntent.status}` })
    }

    if (paymentIntent.metadata?.orderId !== order._id.toString()) {
      return res.status(400).json({ error: 'Payment does not match order' })
    }

    if (paymentIntent.metadata?.buyerId !== String(req.auth._id)) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    // Idempotency: If order is already in_progress or further, return success
    if (['in_progress', 'completed', 'cancelled'].includes(order.status)) {
      return res.status(200).json({ success: true, order, message: 'Order already processed' })
    }

    // Update order status
    order.status = 'in_progress'
    order.paymentId = paymentIntent.id
    order.updated = Date.now()
    const updatedOrder = await order.save()

    return res.status(200).json({ success: true, order: updatedOrder })
  } catch (err) {
    console.error('Confirm Payment error:', err)
    return res.status(500).json({ error: 'Could not confirm payment' })
  }
}

export default {
  createPaymentIntent,
  confirmPayment
}
