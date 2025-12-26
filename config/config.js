import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables from local files if present.
// This keeps dev setup simple (Stripe keys, Mongo URI, etc.) without requiring shell exports.
const dotenvCandidates = [
  path.resolve(process.cwd(), 'server', '.env'),
  path.resolve(process.cwd(), '.env')
]

const loadedDotenvPath = dotenvCandidates.find(p => fs.existsSync(p))

if (loadedDotenvPath) {
  dotenv.config({ path: loadedDotenvPath })
} else {
  // For template/dev usage: allow running without creating a local .env
  // by falling back to the example env file. Do NOT do this in production.
  const env = process.env.NODE_ENV || 'development'
  if (env !== 'production') {
    const examplePath = path.resolve(process.cwd(), 'server', '.env.example')
    if (fs.existsSync(examplePath)) {
      dotenv.config({ path: examplePath })
    }
  }
}

const env = process.env.NODE_ENV || 'development'

// Validate required environment variables in production
const validateEnv = () => {
  if (env === 'production') {
    const required = ['JWT_SECRET', 'MONGODB_URI']
    const missing = required.filter(key => !process.env[key])
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long')
    }
  }
}

validateEnv()

const config = {
  env,
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production_abc123',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/service-marketplace',
  stripe_connect_test_client_id: process.env.STRIPE_CONNECT_TEST_CLIENT_ID || '',
  stripe_test_secret_key: process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '',
  stripe_test_api_key: process.env.STRIPE_TEST_API_KEY || '',
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLIC_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
}

export default config

