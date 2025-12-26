import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { read } from './api-order.js'

export default function Order() {
  const { orderId } = useParams()
  const [order, setOrder] = useState({
    service: {},
    buyer: {},
    seller: {},
    status: '',
    amount: 0,
    created: new Date()
  })

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    read({
      orderId: orderId
    }, signal).then((data) => {
      if (data && data.error) {
        console.debug(data.error)
      } else {
        setOrder(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [orderId])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Summary</h1>
            <p className="text-gray-500 font-medium">
              Order <span className="text-primary">#{order._id}</span> • Placed on {new Date(order.created).toDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-100 text-green-600' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                order.status === 'delivered' ? 'bg-purple-100 text-purple-600' :
                  'bg-blue-100 text-blue-600'
              }`}>
              {order.status || 'Pending'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Main Details */}
          <div className="lg:col-span-2 p-8 md:p-12 space-y-10">
            {/* Service Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">1</span>
                Service Details
              </h2>
              <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 group">
                {order.service && (
                  <>
                    <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-md">
                      <img src={`/api/service/image/${order.service._id}`} alt={order.service.title || 'Service Image'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/service/${order.service._id}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors block mb-1">
                        {order.service.title}
                      </Link>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{order.service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-black text-2xl">${order.amount}</span>
                        <span className="text-gray-400 text-sm font-medium italic">Single Purchase</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Buyer Requirements */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">2</span>
                Project Requirements
              </h2>
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                <p className="text-gray-700 leading-relaxed italic">
                  "{order.requirements || 'No specific requirements provided.'}"
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="bg-gray-50/50 p-8 md:p-12 border-l border-gray-50 space-y-10">
            {/* Seller Info */}
            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Service Provider</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-2xl">
                  {order.seller?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="text-gray-900 font-bold">{order.seller?.name || 'Loading...'}</p>
                  <p className="text-gray-500 text-sm">{order.seller?.email}</p>
                </div>
              </div>
            </div>

            {/* Buyer Info */}
            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Customer</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-2xl">
                  {order.buyer?.name?.charAt(0) || 'B'}
                </div>
                <div>
                  <p className="text-gray-900 font-bold">{order.buyer?.name || 'Loading...'}</p>
                  <p className="text-gray-500 text-sm">{order.buyer?.email}</p>
                </div>
              </div>
            </div>

            <Divider className="my-8" />

            <div className="pt-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Need Help?</h3>
              <p className="text-gray-500 text-sm mb-6">If you have any issues with this order, please contact our support team.</p>
              <button className="w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Divider = ({ className }) => <div className={`h-px bg-gray-200 ${className}`} />
