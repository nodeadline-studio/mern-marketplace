import express from 'express'
import orderCtrl from '../controllers/order.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

// Create service order
router.route('/api/orders/:userId')
  .post(authCtrl.requireSignin, orderCtrl.create)

// Get orders by buyer
router.route('/api/orders/user/:userId')
  .get(authCtrl.requireSignin, orderCtrl.listByBuyer)

// Get orders by seller
router.route('/api/orders/seller/:userId')
  .get(authCtrl.requireSignin, orderCtrl.listBySeller)

// Update order status
router.route('/api/order/:orderId/status')
  .put(authCtrl.requireSignin, orderCtrl.orderByID, orderCtrl.updateStatus)

// Get order by ID
router.route('/api/order/:orderId')
  .get(orderCtrl.orderByID, orderCtrl.read)

router.param('userId', userCtrl.userByID)
router.param('orderId', orderCtrl.orderByID)

export default router
