import mongoose from 'mongoose'
import { Order } from '../models/order.model'
import Review from '../models/review.model'
import Service from '../models/service.model'
import errorHandler from './../helpers/dbErrorHandler'

/**
 * Create a new review
 */
const create = async (req, res) => {
  try {
    const { serviceId, orderId, rating, comment } = req.body

    if (!serviceId || !rating) {
      return res.status(400).json({ error: 'Service ID and rating are required' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    // Verify service exists
    const service = await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    // If order ID provided, verify buyer owns the order
    if (orderId) {
      const order = await Order.findById(orderId)
      if (!order) {
        return res.status(404).json({ error: 'Order not found' })
      }
      if (order.buyer.toString() !== req.auth._id) {
        return res.status(403).json({ error: 'Not authorized to review this order' })
      }
      if (order.status !== 'completed') {
        return res.status(400).json({ error: 'Can only review completed orders' })
      }
    }

    const review = new Review({
      service: serviceId,
      order: orderId || undefined,
      buyer: req.auth._id,
      rating,
      comment
    })

    const result = await review.save()
    const populated = await Review.findById(result._id)
      .populate('buyer', 'name')
      .exec()

    return res.status(201).json(populated)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

/**
 * List reviews for a service
 */
const listByService = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('buyer', 'name')
      .sort('-created')
      .exec()

    res.json(reviews)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

/**
 * Get average rating for a service
 */
const getServiceStats = async (req, res) => {
  try {
    const { serviceId } = req.params
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: 'Invalid service ID' })
    }

    // Ensure service exists (clearer API behavior than silently returning empty stats)
    const service = await Service.findById(serviceId).select('_id').exec()
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    const stats = await Review.aggregate([
      { $match: { service: service._id } },
      {
        $group: {
          _id: '$service',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        }
      }
    ])

    if (stats.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0, breakdown: {} })
    }

    // Calculate rating breakdown
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    stats[0].ratings.forEach((r) => {
      breakdown[r] = (breakdown[r] || 0) + 1
    })

    res.json({
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      breakdown
    })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

/**
 * Add seller response to a review
 */
const addResponse = async (req, res) => {
  try {
    const { response } = req.body
    if (!response) {
      return res.status(400).json({ error: 'Response is required' })
    }

    const review = await Review.findById(req.params.reviewId)
      .populate('service', 'seller')
      .exec()

    if (!review) {
      return res.status(404).json({ error: 'Review not found' })
    }

    // Verify seller owns the service
    if (review.service.seller.toString() !== req.auth._id) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    review.sellerResponse = response
    review.updated = Date.now()
    await review.save()

    res.json(review)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default {
  create,
  listByService,
  getServiceStats,
  addResponse
}
