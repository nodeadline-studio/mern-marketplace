import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title is required'
  },
  description: {
    type: String,
    trim: true,
    required: 'Description is required'
  },
  price: {
    type: Number,
    required: 'Price is required',
    min: 0
  },
  category: {
    type: String,
    required: 'Category is required'
  },
  deliveryTime: {
    type: Number,
    required: 'Delivery time is required',
    min: 1,
    default: 7
  },
  revisions: {
    type: Number,
    required: 'Number of revisions is required',
    min: 0,
    default: 1
  },
  requirements: {
    type: String,
    trim: true
  },
  portfolio: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    data: Buffer,
    contentType: String
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Seller is required'
  }
})

ServiceSchema.index({ title: 'text', description: 'text', tags: 'text' })
ServiceSchema.index({ category: 1 })
ServiceSchema.index({ seller: 1 })
ServiceSchema.index({ status: 1 })
ServiceSchema.index({ featured: 1, status: 1 })

export default mongoose.model('Service', ServiceSchema)
