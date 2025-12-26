import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import auth from './../auth/auth-helper'
import { listByBuyer } from './api-order.js'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const jwt = auth.isAuthenticated()
  const location = useLocation()
  const userId = jwt && jwt.user ? jwt.user._id : null
  const token = jwt ? jwt.token : null

  useEffect(() => {
    if (!userId || !token) {
      return
    }

    const abortController = new AbortController()
    const signal = abortController.signal
    listByBuyer({
      userId
    }, { t: token }, signal).then((data) => {
      if (data && data.error) {
        console.debug(data.error)
      } else {
        setOrders(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [userId, token])

  if (!userId) {
    if (location?.pathname === '/myorders') {
      return <Navigate to='/signin' replace />
    }
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 font-medium">Sign in to view your orders.</p>
        <Link to="/signin" className="text-primary font-bold hover:underline mt-2 inline-block">
          Go to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Your Orders</h1>
            <p className="text-gray-500 text-sm">Track your service purchases</p>
          </div>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
            {orders.length} Orders
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {orders.length > 0 ? (
            orders.map((order, i) => (
              <Link
                key={i}
                to={"/order/" + order._id}
                className="flex items-center p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-900 font-bold group-hover:text-primary transition-colors">
                      Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-green-600' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Placed on {new Date(order.created).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
                <div className="text-right mr-6">
                  <p className="text-gray-900 font-black text-lg">${order.amount}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  →
                </div>
              </Link>
            ))
          ) : (
            <div className="p-20 text-center">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-400 font-medium">You haven't placed any orders yet.</p>
              <Link to="/" className="text-primary font-bold hover:underline mt-2 inline-block">
                Start browsing services
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
