import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'

// Singleton pattern for stripe promise to avoid re-initializing on every render
let stripePromiseInstance = null
const getStripePromise = () => {
  const publishableKey = window.STRIPE_PUBLISHABLE_KEY
  if (!publishableKey) return null

  if (!stripePromiseInstance) {
    stripePromiseInstance = loadStripe(publishableKey)
  }
  return stripePromiseInstance
}

function CheckoutForm({ serviceId, displayAmount, requirements, deliveryDeadline, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please wait a moment.')
      return
    }

    setProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Card element not found')
      setProcessing(false)
      return
    }

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
        setProcessing(false)
        return
      }

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
        setError('Payment not completed. Status: ' + (confirmResult.paymentIntent?.status || 'unknown'))
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
    } catch (err) {
      console.error('Submission error:', err)
      setError('An unexpected error occurred. Please try again.')
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
          <i className="fa-solid fa-triangle-exclamation"></i> {error}
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
  // Memoize it so it doesn't re-run every parent render
  const stripePromise = useMemo(() => getStripePromise(), [])

  if (!stripePromise) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100 text-sm font-medium">
        <i className="fa-solid fa-triangle-exclamation"></i> Stripe is not configured. Set <strong>STRIPE_PUBLISHABLE_KEY</strong> on the server and reload.
      </div>
    )
  }

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

