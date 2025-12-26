import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.ObjectId, ref: 'Service', required: 'Service is required' },
  buyer: { type: mongoose.Schema.ObjectId, ref: 'User', required: 'Buyer is required' },
  seller: { type: mongoose.Schema.ObjectId, ref: 'User', required: 'Seller is required' },
  amount: { type: Number, required: 'Amount is required', min: 0 },
  requirements: { type: String, trim: true },
  deliveryDeadline: { type: Date },
  revisionsUsed: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentId: { type: String, trim: true },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})

const Order = mongoose.model('Order', OrderSchema)

export { Order }
