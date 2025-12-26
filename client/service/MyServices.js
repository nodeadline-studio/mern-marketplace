import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import auth from './../auth/auth-helper'
import { listBySeller } from './api-service.js'
import DeleteService from './DeleteService'

export default function MyServices() {
  const { userId } = useParams()
  const [services, setServices] = useState([])
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listBySeller({
      userId: userId
    }, signal).then((data) => {
      if (data && data.error) {
        console.debug(data.error)
      } else {
        setServices(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [userId])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Services</h1>
            <p className="text-gray-500 text-sm">Manage your professional offerings</p>
          </div>
          <Link
            to={`/seller/${userId}/services/new`}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95"
          >
            <span className="text-lg">+</span> Create Service
          </Link>
        </div>

        <div className="divide-y divide-gray-50">
          {services.length > 0 ? (
            services.map((service, i) => (
              <div key={i} className="p-6 hover:bg-gray-50 transition-colors group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-24 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <img
                      src={`/api/service/image/${service._id}`}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Link to={`/service/${service._id}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors truncate">
                        {service.title}
                      </Link>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${service.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                        {service.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-1">{service.description}</p>
                    <div className="flex items-center gap-6">
                      <span className="text-primary font-black text-xl">${service.price}</span>
                      <div className="h-4 w-px bg-gray-200" />
                      <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">{service.category}</span>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 justify-center">
                    <Link
                      to={`/seller/${userId}/services/${service._id}/edit`}
                      className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all shadow-sm flex items-center justify-center"
                    >
                      ✏️
                    </Link>
                    <DeleteService
                      serviceId={service._id}
                      userId={userId}
                      onDeleted={(deletedId) => setServices(services.filter(s => s._id !== deletedId))}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <div className="text-5xl mb-4 text-gray-200">🛠️</div>
              <p className="text-gray-400 font-medium">You haven't created any services yet.</p>
              <Link to={`/seller/${userId}/services/new`} className="text-primary font-bold hover:underline mt-2 inline-block">
                Create your first service now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
