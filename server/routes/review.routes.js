import express from 'express'
import authCtrl from '../controllers/auth.controller'
import reviewCtrl from '../controllers/review.controller'

const router = express.Router()

// Create a review (requires auth)
router.route('/api/reviews')
  .post(authCtrl.requireSignin, reviewCtrl.create)

// List reviews for a service
router.route('/api/reviews/service/:serviceId')
  .get(reviewCtrl.listByService)

// Get review stats for a service
router.route('/api/reviews/stats/:serviceId')
  .get(reviewCtrl.getServiceStats)

// Add seller response to a review
router.route('/api/reviews/:reviewId/response')
  .put(authCtrl.requireSignin, reviewCtrl.addResponse)

export default router
