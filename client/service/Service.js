import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReviewList } from '../review/ReviewComponents'
import { listRelated, read } from './api-service.js'
import OrderService from './OrderService'
import Suggestions from './Suggestions'

export default function Service() {
  const { serviceId } = useParams()
  const [service, setService] = useState({ seller: {} })
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ serviceId: serviceId }, signal).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setService(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [serviceId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listRelated({ serviceId: serviceId }, signal).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setSuggestions(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [serviceId])

  const imageUrl = service._id
    ? `/api/service/image/${service._id}?${new Date().getTime()}`
    : '/api/service/defaultphoto'

  const getStatusClasses = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusClasses(service.status)}`}>
                      {service.status}
                    </span>
                    {service.featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary-light/20 text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <OrderService service={service} />
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <img src={imageUrl} alt={service.title || 'Service Image'} className="w-full h-64 object-cover rounded-xl shadow-inner border border-gray-100" onError={(e) => { e.target.onerror = null; e.target.src = '/api/service/defaultphoto' }} />
                </div>

                <div className="md:w-1/2 space-y-6">
                  <p className="text-gray-600 leading-relaxed text-lg italic">
                    "{service.description}"
                  </p>

                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                    <span className="text-3xl font-bold text-primary">$ {service.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">🕒</span>
                      <span className="font-medium">{service.deliveryTime} days delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">🔄</span>
                      <span className="font-medium">{service.revisions} Revisions</span>
                    </div>
                  </div>

                  {service.requirements && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <h4 className="font-bold text-yellow-800 mb-1 flex items-center gap-2">
                        <span>💡</span> Buyer Requirements
                      </h4>
                      <p className="text-yellow-700 text-sm">{service.requirements}</p>
                    </div>
                  )}

                  {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {service.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-md border border-gray-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <hr className="border-gray-100" />

                  <Link
                    to={`/user/${service.seller._id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      👤
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-primary transition-colors">
                      {service.seller.name}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {service._id && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-bold px-8 pt-6 text-gray-900">Reviews</h2>
              <ReviewList serviceId={service._id} />
            </div>
          )}
        </div>

        {/* Sidebar Suggestions */}
        {suggestions.length > 0 && (
          <div className="lg:w-1/3">
            <Suggestions services={suggestions} title='Related Services' />
          </div>
        )}
      </div>
    </div>
  )
}

