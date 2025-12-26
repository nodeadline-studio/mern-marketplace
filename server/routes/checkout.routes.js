import express from 'express'
import authCtrl from '../controllers/auth.controller'
import checkoutCtrl from '../controllers/checkout.controller'

const router = express.Router()

// Create payment intent (requires auth)
router.route('/api/checkout')
  .post(authCtrl.requireSignin, checkoutCtrl.createPaymentIntent)

// Confirm payment (requires auth)
router.route('/api/checkout/confirm')
  .post(authCtrl.requireSignin, checkoutCtrl.confirmPayment)

export default router
