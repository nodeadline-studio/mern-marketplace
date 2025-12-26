import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    required: 'Service is required'
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Buyer is required'
  },
  rating: {
    type: Number,
    required: 'Rating is required',
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  sellerResponse: {
    type: String,
    trim: true,
    maxlength: [300, 'Response cannot exceed 300 characters']
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date
})

// Prevent duplicate reviews for same order
ReviewSchema.index({ order: 1 }, { unique: true, sparse: true })
// Index for fetching reviews by service
ReviewSchema.index({ service: 1, created: -1 })
// Index for fetching reviews by buyer
ReviewSchema.index({ buyer: 1 })

export default mongoose.model('Review', ReviewSchema)
