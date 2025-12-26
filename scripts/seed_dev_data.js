/* eslint-disable no-console */

import mongoose from 'mongoose'
import config from '../config/config.js'
import Service from '../server/models/service.model.js'
import User from '../server/models/user.model.js'

const ensureConnection = async () => {
  mongoose.Promise = global.Promise
  await mongoose.connect(config.mongoUri)
}

const upsertUser = async ({ email, name, password, sellerProfile }) => {
  const existing = await User.findOne({ email })
  if (existing) return existing

  const user = new User({
    name,
    email,
    seller: !!sellerProfile,
    sellerProfile: sellerProfile || {}
  })

  user.password = password
  await user.save()
  return user
}

const createServiceIfMissing = async ({ title, seller, price, category, description, deliveryTime, revisions, featured }) => {
  const existing = await Service.findOne({ title, seller: seller._id })
  if (existing) return existing

  const service = new Service({
    title,
    description,
    price,
    category,
    deliveryTime,
    revisions,
    status: 'active',
    featured: !!featured,
    seller: seller._id,
    requirements: 'Please share any relevant requirements and assets.'
  })

  await service.save()
  return service
}

const main = async () => {
  await ensureConnection()

  const seedPassword = process.env.SEED_USER_PASSWORD || 'password123'

  const sellerA = await upsertUser({
    email: 'seller1@example.com',
    name: 'Seller One',
    password: seedPassword,
    sellerProfile: {
      bio: 'I help businesses launch and grow with reliable delivery.',
      skills: ['Design', 'Branding', 'Web'],
      rating: 4.8,
      totalOrders: 12,
      verified: true,
      languages: ['English']
    }
  })

  const sellerB = await upsertUser({
    email: 'seller2@example.com',
    name: 'Seller Two',
    password: seedPassword,
    sellerProfile: {
      bio: 'Fast turnaround, clear communication, professional results.',
      skills: ['Video', 'Editing', 'Social'],
      rating: 4.6,
      totalOrders: 7,
      verified: false,
      languages: ['English']
    }
  })

  await upsertUser({
    email: 'buyer1@example.com',
    name: 'Buyer One',
    password: seedPassword
  })

  await createServiceIfMissing({
    title: 'Logo design for your brand',
    seller: sellerA,
    price: 49,
    category: 'Design',
    description: 'A clean and modern logo design with 2 revisions included.',
    deliveryTime: 3,
    revisions: 2,
    featured: true
  })

  await createServiceIfMissing({
    title: 'Landing page UI (Figma)',
    seller: sellerA,
    price: 99,
    category: 'Design',
    description: 'A conversion-focused landing page design delivered in Figma.',
    deliveryTime: 5,
    revisions: 2,
    featured: false
  })

  await createServiceIfMissing({
    title: 'Short-form video editing (30-60s)',
    seller: sellerB,
    price: 79,
    category: 'Video',
    description: 'Editing optimized for TikTok/Reels/Shorts with captions.',
    deliveryTime: 2,
    revisions: 1,
    featured: true
  })

  console.log('Seed complete.')
  console.log('Test accounts (dev only):')
  console.log(`- buyer1@example.com / ${seedPassword}`)
  console.log(`- seller1@example.com / ${seedPassword}`)
  console.log(`- seller2@example.com / ${seedPassword}`)

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  try {
    await mongoose.disconnect()
  } catch {
    // ignore
  }
  process.exit(1)
})
