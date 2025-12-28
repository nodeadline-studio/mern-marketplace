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
    redirect: false,
    orderId: ''
  })
  const jwt = auth.isAuthenticated()

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value, error: '' })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setValues({ ...values, requirements: '', deliveryDeadline: '', error: '', orderId: '' })
  }

  if (values.redirect) {
    return <Navigate to="/checkout/success" state={{ orderId: values.orderId }} replace />
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
                <i className="fa-solid fa-xmark"></i>
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

              {jwt ? (
                <StripeCheckout
                  serviceId={service._id}
                  displayAmount={Number(service.price)}
                  requirements={values.requirements}
                  deliveryDeadline={values.deliveryDeadline || undefined}
                  onSuccess={(data) => {
                    setValues({ ...values, error: '', orderId: data.orderId, redirect: true })
                  }}
                  onError={(err) => {
                    const message = typeof err?.message === 'string' ? err.message : (typeof err?.error === 'string' ? err.error : null)
                    if (message) setValues({ ...values, error: message })
                  }}
                />
              ) : (
                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto">
                    <i className="fa-solid fa-user-lock"></i>
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Authentication Required</h3>
                    <p className="text-gray-500 text-sm">Please sign in to your account to place an order and track its progress.</p>
                  </div>
                  <Link
                    to="/signin"
                    className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    Sign In Now
                  </Link>
                </div>
              )}

              {values.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium animate-shake">
                  <i className="fa-solid fa-triangle-exclamation"></i> {values.error}
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
