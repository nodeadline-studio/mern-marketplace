import bodyParser from 'body-parser'
import compress from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import path from 'path'
import config from './../config/config'
import Template from './../template'
import authRoutes from './routes/auth.routes'
import checkoutRoutes from './routes/checkout.routes'
import orderRoutes from './routes/order.routes'
import reviewRoutes from './routes/review.routes'
import serviceRoutes from "./routes/service.routes"
import userRoutes from './routes/user.routes'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

// Development mode only: enable hot reloading
if (config.env === 'development') {
  const devBundleModule = require('./devBundle')
  const devBundle = devBundleModule?.default || devBundleModule
  devBundle.compile(app)
}

// parse body params and attach them to req.body
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(cookieParser())
app.use(compress())

// secure apps by setting various HTTP headers
app.use(helmet({
  contentSecurityPolicy: config.env === 'production' ? undefined : false
}))

// enable CORS - Cross Origin Resource Sharing
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}))

// Rate limiting - prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window for auth routes
  message: { error: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window for general API
  message: { error: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

// Apply rate limiting
app.use('/auth', authLimiter)
app.use('/api', apiLimiter)

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use("/", serviceRoutes)
app.use('/', orderRoutes)
app.use('/', reviewRoutes)
app.use('/', checkoutRoutes)


// Serve the SPA for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.status(200).send(Template({ stripePublishableKey: config.stripe_publishable_key }))
})

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Authentication required' })
  } else if (err) {
    res.status(400).json({ error: config.env === 'development' ? err.message : 'An error occurred' })
    if (config.env === 'development') {
      console.error(err)
    }
  }
})

export default app
