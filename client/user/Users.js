import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { list } from './api-user.js'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.debug(data.error)
      } else {
        setUsers(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Discover Top Freelancers</h1>
        <p className="text-gray-500 text-lg">Connect with professionals who can help you bring your ideas to life.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {users.map((user, i) => (
          <Link
            key={i}
            to={"/user/" + user._id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold mb-4 group-hover:scale-110 transition-transform">
              {user.name.charAt(0)}
            </div>

            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
              {user.name}
            </h3>

            <p className="text-gray-500 text-sm mt-1 line-clamp-1">
              {user.seller ? 'Professional Seller' : 'Platform Member'}
            </p>

            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
              View Profile <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">No freelancers found yet.</p>
        </div>
      )}
    </div>
  )
}
