import {
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PropTypes from 'prop-types'
import { useState } from 'react'

const getStripePromise = () => {
  const publishableKey = window.STRIPE_PUBLISHABLE_KEY
  if (!publishableKey) return null
  return loadStripe(publishableKey)
}

function CheckoutForm({ serviceId, displayAmount, requirements, deliveryDeadline, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          serviceId,
          requirements,
          deliveryDeadline
        })
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error)
        if (onError) onError(result)
      } else {
        const { clientSecret, orderId } = result

        const confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement
          }
        })

        if (confirmResult.error) {
          setError(confirmResult.error.message)
          if (onError) onError(confirmResult.error)
          setProcessing(false)
          return
        }

        if (confirmResult.paymentIntent?.status !== 'succeeded') {
          setError('Payment not completed. Please try again.')
          setProcessing(false)
          return
        }

        const confirmResponse = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentIntentId: confirmResult.paymentIntent.id,
            orderId
          })
        })

        const confirmBody = await confirmResponse.json()

        if (confirmBody?.error) {
          setError(confirmBody.error)
          if (onError) onError(confirmBody)
          setProcessing(false)
          return
        }

        if (onSuccess) onSuccess({ orderId, paymentIntentId: confirmResult.paymentIntent.id })
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
      if (onError) onError(err)
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="card-element" className="block text-sm font-bold text-gray-700 label-modern">
          Card Details
        </label>
        <div className="input-field py-3">
          <CardElement id="card-element" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium" role="alert">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay $${Number(displayAmount).toFixed(2)}`}
      </button>
    </form>
  )
}

CheckoutForm.propTypes = {
  serviceId: PropTypes.string.isRequired,
  displayAmount: PropTypes.number.isRequired,
  requirements: PropTypes.string,
  deliveryDeadline: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func
}

export default function StripeCheckout(props) {
  const stripePromise = getStripePromise()

  if (!stripePromise) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100 text-sm font-medium">
        Stripe is not configured. Set <strong>STRIPE_PUBLISHABLE_KEY</strong> on the server and reload.
      </div>
    )
  }

  const { Elements } = require('@stripe/react-stripe-js')

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}

StripeCheckout.propTypes = {
  serviceId: PropTypes.string.isRequired,
  displayAmount: PropTypes.number.isRequired,
  requirements: PropTypes.string,
  deliveryDeadline: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func
}
