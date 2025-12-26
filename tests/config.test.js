/**
 * Unit tests for config validation
 */

describe('Config Validation', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('allows development mode without JWT_SECRET', () => {
    process.env.NODE_ENV = 'development'
    delete process.env.JWT_SECRET
    delete process.env.MONGODB_URI

    // Should not throw in development
    expect(() => {
      const validateEnv = () => {
        const env = process.env.NODE_ENV || 'development'
        if (env === 'production') {
          const required = ['JWT_SECRET', 'MONGODB_URI']
          const missing = required.filter(key => !process.env[key])
          if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
          }
        }
      }
      validateEnv()
    }).not.toThrow()
  })

  test('throws in production when JWT_SECRET is missing', () => {
    process.env.NODE_ENV = 'production'
    delete process.env.JWT_SECRET
    process.env.MONGODB_URI = 'mongodb://localhost/test'

    expect(() => {
      const validateEnv = () => {
        const env = process.env.NODE_ENV || 'development'
        if (env === 'production') {
          const required = ['JWT_SECRET', 'MONGODB_URI']
          const missing = required.filter(key => !process.env[key])
          if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
          }
        }
      }
      validateEnv()
    }).toThrow('Missing required environment variables: JWT_SECRET')
  })

  test('throws in production when MONGODB_URI is missing', () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'a-very-long-secret-key-for-testing-purposes'
    delete process.env.MONGODB_URI

    expect(() => {
      const validateEnv = () => {
        const env = process.env.NODE_ENV || 'development'
        if (env === 'production') {
          const required = ['JWT_SECRET', 'MONGODB_URI']
          const missing = required.filter(key => !process.env[key])
          if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
          }
        }
      }
      validateEnv()
    }).toThrow('Missing required environment variables: MONGODB_URI')
  })

  test('passes in production when all required variables are set', () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'a-very-long-secret-key-for-testing-purposes'
    process.env.MONGODB_URI = 'mongodb://localhost/test'

    expect(() => {
      const validateEnv = () => {
        const env = process.env.NODE_ENV || 'development'
        if (env === 'production') {
          const required = ['JWT_SECRET', 'MONGODB_URI']
          const missing = required.filter(key => !process.env[key])
          if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
          }
        }
      }
      validateEnv()
    }).not.toThrow()
  })
})
