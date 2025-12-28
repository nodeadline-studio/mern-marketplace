import { Order } from '../models/order.model'
import Service from '../models/service.model'
import errorHandler from './../helpers/dbErrorHandler'

// Create a service order. Expects body: { serviceId, requirements, deliveryDeadline }
const create = async (req, res) => {
  try {
    const { serviceId, requirements, deliveryDeadline } = req.body
    if (!serviceId) {
      return res.status(400).json({ error: 'Service ID is required' })
    }

    // Load service to derive seller and price
    const service = await Service.findById(serviceId).select('_id seller price deliveryTime').populate('seller', '_id').exec()
    if (!service) {
      return res.status(400).json({ error: 'Service not found' })
    }

    const order = new Order({
      service: service._id,
      buyer: req.profile._id,
      seller: service.seller._id || service.seller,
      amount: service.price,
      requirements,
      deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline) : undefined,
      status: 'pending'
    })

    const result = await order.save()
    return res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByBuyer = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.profile._id })
      .populate('service', 'title price deliveryTime')
      .populate('seller', 'name')
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const listBySeller = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.profile._id })
      .populate('service', 'title price deliveryTime')
      .populate('buyer', 'name')
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = req.order
    const userId = req.auth?._id || req.profile?._id

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }
    const allowed = ['in_progress', 'delivered', 'completed', 'cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    // Security Gate: Verify if user is authorized for this transition
    if (status === 'delivered') {
      if (order.seller._id.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Only the seller can mark an order as delivered" })
      }
    }

    if (status === 'completed') {
      if (order.buyer._id.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Only the buyer can mark an order as completed" })
      }
      if (order.status !== 'delivered') {
        return res.status(400).json({ error: "Order must be delivered before it can be completed" })
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      { status, updated: Date.now() },
      { new: true }
    )
    res.json(updatedOrder)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const orderByID = async (req, res, next, id) => {
  try {
    const order = await Order.findById(id)
      .populate('service', 'title price deliveryTime')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .exec()
    if (!order) {
      return res.status('400').json({ error: 'Order not found' })
    }
    req.order = order
    next()
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const read = (req, res) => {
  return res.json(req.order)
}

export default {
  create,
  listByBuyer,
  listBySeller,
  updateStatus,
  orderByID,
  read
}
