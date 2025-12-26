import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const SALT_ROUNDS = 12

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+@.+\..+/, "Please fill a valid email address"],
    required: 'Email is required',
    lowercase: true
  },
  hashed_password: {
    type: String,
    required: "Password is required"
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  seller: {
    type: Boolean,
    default: false
  },
  sellerProfile: {
    bio: { type: String, trim: true, maxlength: 500 },
    skills: [{ type: String, trim: true }],
    portfolio: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalOrders: { type: Number, default: 0, min: 0 },
    verified: { type: Boolean, default: false },
    languages: [{ type: String, trim: true }]
  },
  stripe_seller: {},
  stripe_customer: {}
})

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    // Synchronous hash for virtual setter - will be validated in pre-save
    if (password && password.length >= 8) {
      this.hashed_password = bcrypt.hashSync(password, SALT_ROUNDS)
    }
  })
  .get(function () {
    return this._password
  })

UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 8) {
    this.invalidate('password', 'Password must be at least 8 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

UserSchema.methods = {
  // Async password comparison using bcrypt
  authenticate: function (plainText) {
    return bcrypt.compareSync(plainText, this.hashed_password)
  },
  // Async version for better performance in routes
  authenticateAsync: async function (plainText) {
    return bcrypt.compare(plainText, this.hashed_password)
  }
}

// Index for faster email lookups
UserSchema.index({ email: 1 })

export default mongoose.model('User', UserSchema)

