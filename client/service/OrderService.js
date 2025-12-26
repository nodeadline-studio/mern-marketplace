import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import auth from './../auth/auth-helper'
import StripeCheckout from './../checkout/StripeCheckout'

export default function OrderService({ service }) {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({
    requirements: '',
    deliveryDeadline: '',
    error: '',
    redirect: false
  })
  const jwt = auth.isAuthenticated()

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value, error: '' })
  }

  const handleClickOpen = () => {
    if (!jwt) {
      setValues({ ...values, error: 'Please sign in to order this service' })
      return
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setValues({ ...values, requirements: '', deliveryDeadline: '', error: '' })
  }

  if (values.redirect) {
    return <Navigate to="/myorders" replace />
  }

  return (
    <>
      <button
        onClick={handleClickOpen}
        className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
      >
        Order Service
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-extrabold text-gray-900">Place Your Order</h2>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Service</p>
                  <p className="text-gray-900 font-bold">{service.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Total</p>
                  <p className="text-gray-900 font-black text-2xl">${service.price}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Requirements for Seller</label>
                <textarea
                  rows="4"
                  className="input-field resize-none"
                  value={values.requirements}
                  onChange={handleChange('requirements')}
                  placeholder="Describe what you need in detail so the seller can get started..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Preferred Deadline (optional)</label>
                <input
                  type="date"
                  className="input-field"
                  value={values.deliveryDeadline}
                  onChange={handleChange('deliveryDeadline')}
                />
                <p className="text-xs text-gray-400 mt-2">
                  * Average delivery time for this service is {service.deliveryTime} days.
                </p>
              </div>

              <StripeCheckout
                serviceId={service._id}
                displayAmount={Number(service.price)}
                requirements={values.requirements}
                deliveryDeadline={values.deliveryDeadline || undefined}
                onSuccess={() => {
                  setValues({ ...values, error: '', redirect: true })
                }}
                onError={(err) => {
                  const message = typeof err?.message === 'string' ? err.message : (typeof err?.error === 'string' ? err.error : null)
                  if (message) setValues({ ...values, error: message })
                }}
              />

              {values.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium animate-shake">
                  ⚠️ {values.error}
                </div>
              )}

              {!jwt && !values.error && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100 text-sm font-medium">
                  Please <Link to="/signin" className="underline font-bold">sign in</Link> to complete your order.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-50 flex gap-4">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

OrderService.propTypes = {
  service: PropTypes.object.isRequired
}
