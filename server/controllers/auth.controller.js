import { expressjwt } from 'express-jwt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import config from './../../config/config'

const getJwtFromRequest = (req) => {
  const authHeader = req.headers?.authorization
  if (typeof authHeader === 'string') {
    const parts = authHeader.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1]
    }
  }

  // Primary auth mechanism: httpOnly cookie
  if (req.cookies && typeof req.cookies.t === 'string' && req.cookies.t.length > 0) {
    return req.cookies.t
  }

  return null
}

const signin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Use async bcrypt comparison
    const isMatch = await user.authenticateAsync(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { _id: user._id },
      config.jwtSecret,
      {
        algorithm: 'HS256',
        expiresIn: config.jwtExpiresIn
      }
    )

    // Secure cookie configuration
    res.cookie('t', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax'
    })

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller
      }
    })
  } catch (err) {
    return res.status(500).json({ error: 'Could not sign in' })
  }
}

const signout = (req, res) => {
  res.clearCookie('t', {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax'
  })
  return res.status(200).json({ message: 'Signed out successfully' })
}

const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth',
  getToken: getJwtFromRequest
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id.toString() === String(req.auth._id)
  if (!authorized) {
    return res.status(403).json({ error: 'User is not authorized' })
  }
  next()
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}

