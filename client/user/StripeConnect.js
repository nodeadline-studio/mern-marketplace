import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import auth from './../auth/auth-helper'
import { stripeUpdate } from './api-user.js'

export default function StripeConnect() {
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const params = new URLSearchParams(location.search)
    const error = params.get('error')
    const code = params.get('code')

    if (error) {
      setValues({ ...values, error: true })
    }
    if (code) {
      setValues({ ...values, connecting: true, error: false })
      stripeUpdate({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, code, signal).then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: true, connected: false, connecting: false })
        } else {
          setValues({ ...values, connected: true, connecting: false, error: false })
        }
      })
    }
    return function cleanup() {
      abortController.abort()
    }
  }, [location.search, jwt.user._id, jwt.token])

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center p-12">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-8">
          <i className="fa-solid fa-credit-card"></i>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Connect with Stripe</h1>

        <div className="space-y-6">
          {values.error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-medium">
              <p className="text-lg mb-1">Could not connect account</p>
              <p className="text-sm opacity-80">Something went wrong during the Stripe authentication process. Please try again later.</p>
            </div>
          )}

          {values.connecting && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-medium italic">Establishing secure connection to Stripe...</p>
            </div>
          )}

          {values.connected && (
            <div className="bg-green-50 text-green-600 p-6 rounded-2xl border border-green-100 font-medium animate-in zoom-in-95">
              <p className="text-lg mb-1">Successfully Connected!</p>
              <p className="text-sm opacity-80 text-gray-500">Your account is now ready to receive payments for your services.</p>
              <button
                onClick={() => navigate(`/user/${jwt.user._id}`)}
                className="mt-6 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200"
              >
                Return to Profile
              </button>
            </div>
          )}

          {!values.connecting && !values.connected && !values.error && (
            <p className="text-gray-500">Waiting for Stripe response...</p>
          )}
        </div>
      </div>
    </div>
  )
}
