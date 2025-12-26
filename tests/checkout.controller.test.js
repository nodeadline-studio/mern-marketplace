/**
 * Unit tests for checkout controller (Stripe mocked)
 *
 * Goal: objectively prove that the server derives amount from Service.price
 * and does not trust client-supplied amount.
 */

const buildRes = () => {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    }
  }
  return res
}

describe('checkout.controller', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...process.env,
      NODE_ENV: 'test',
      JWT_SECRET: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      MONGODB_URI: 'mongodb://localhost:27017/service-marketplace',
      STRIPE_TEST_SECRET_KEY: 'sk_test_mock'
    }
  })

  test('createPaymentIntent derives amount from service price (ignores client amount)', async () => {
    const stripeCreate = jest.fn(async () => ({
      id: 'pi_123',
      client_secret: 'cs_test_123'
    }))

    jest.doMock('stripe', () => {
      return () => ({
        paymentIntents: {
          create: stripeCreate,
          retrieve: jest.fn()
        }
      })
    })

    const mockOrderInstance = {
      _id: 'order_123',
      save: jest.fn(async () => undefined)
    }

    const OrderCtor = jest.fn(() => mockOrderInstance)
    OrderCtor.findById = jest.fn()
    OrderCtor.findByIdAndUpdate = jest.fn()

    jest.doMock('../server/models/order.model', () => ({
      Order: OrderCtor
    }))

    const serviceDoc = {
      _id: 'service_123',
      price: 49.99,
      seller: { _id: 'seller_123' }
    }

    const serviceFindById = jest.fn(() => ({
      populate: () => ({
        exec: async () => serviceDoc
      })
    }))

    jest.doMock('../server/models/service.model', () => ({
      __esModule: true,
      default: {
        findById: serviceFindById
      }
    }))

    const checkoutCtrl = (await import('../server/controllers/checkout.controller.js')).default

    const req = {
      body: { serviceId: 'service_123', amount: 0.01 },
      auth: { _id: 'buyer_123' }
    }
    const res = buildRes()

    await checkoutCtrl.createPaymentIntent(req, res)

    expect(res.statusCode).toBe(200)
    expect(stripeCreate).toHaveBeenCalledTimes(1)

    // Amount must be derived from service.price (49.99) => 4999 cents
    expect(stripeCreate.mock.calls[0][0].amount).toBe(4999)

    // Order amount must match service.price, not client-supplied amount
    expect(OrderCtor).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 49.99,
        service: 'service_123',
        buyer: 'buyer_123',
        seller: 'seller_123',
        status: 'pending'
      })
    )

    expect(res.body).toEqual({
      clientSecret: 'cs_test_123',
      orderId: 'order_123'
    })
  })

  test('createPaymentIntent returns 503 when Stripe is not configured', async () => {
    process.env.STRIPE_TEST_SECRET_KEY = ''

    jest.doMock('stripe', () => {
      return () => ({
        paymentIntents: {
          create: jest.fn(),
          retrieve: jest.fn()
        }
      })
    })

    jest.doMock('../server/models/order.model', () => ({
      Order: jest.fn()
    }))

    jest.doMock('../server/models/service.model', () => ({
      __esModule: true,
      default: {
        findById: jest.fn()
      }
    }))

    const checkoutCtrl = (await import('../server/controllers/checkout.controller.js')).default

    const req = { body: { serviceId: 'service_123' }, auth: { _id: 'buyer_123' } }
    const res = buildRes()

    await checkoutCtrl.createPaymentIntent(req, res)

    expect(res.statusCode).toBe(503)
    expect(res.body).toEqual({ error: 'Stripe is not configured (missing STRIPE_TEST_SECRET_KEY / STRIPE_SECRET_KEY)' })
  })
})
