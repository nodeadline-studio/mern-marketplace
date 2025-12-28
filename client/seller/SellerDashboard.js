import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import auth from '../auth/auth-helper'
import StatusBadge from '../order/StatusBadge'
import { getStripeConfig, read } from '../user/api-user'

export default function SellerDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalEarnings: 0
  })
  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState({ stripe_seller: null })
  const [stripeConfig, setStripeConfig] = useState(null)

  useEffect(() => {
    const jwt = auth.isAuthenticated()
    if (!jwt) {
      navigate('/signin')
      return
    }

    const fetchData = async () => {
      try {
        // Fetch user profile for Stripe status
        const userData = await read({ userId: jwt.user._id }, { t: jwt.token })
        if (userData && !userData.error) {
          setUser(userData)
        }

        // Fetch Stripe config
        const configData = await getStripeConfig({ t: jwt.token })
        if (configData && !configData.error) {
          setStripeConfig(configData)
        }

        // Fetch seller's services
        const servicesRes = await fetch(`/api/services/by/${jwt.user._id}`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include'
        })
        const servicesData = await servicesRes.json()
        setServices(Array.isArray(servicesData) ? servicesData : [])

        // Fetch seller's orders
        const ordersRes = await fetch(`/api/orders/seller/${jwt.user._id}`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include'
        })
        const ordersData = await ordersRes.json()
        setOrders(Array.isArray(ordersData) ? ordersData : [])

        // Calculate stats
        const servicesArr = Array.isArray(servicesData) ? servicesData : []
        const ordersArr = Array.isArray(ordersData) ? ordersData : []

        setStats({
          totalServices: servicesArr.length,
          activeServices: servicesArr.filter(s => s.status === 'active').length,
          pendingOrders: ordersArr.filter(o => o.status === 'pending' || o.status === 'in_progress' || o.status === 'delivered').length,
          completedOrders: ordersArr.filter(o => o.status === 'completed').length,
          totalEarnings: ordersArr
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + (o.amount || 0), 0)
        })
      } catch (err) {
        console.debug('Dashboard fetch error:', err)
      }
      setLoading(false)
    }

    fetchData()
  }, [navigate])

  const stripeOnboardingUrl = stripeConfig?.client_id
    ? `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${stripeConfig.client_id}&scope=read_write`
    : '#'

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your services, track orders, and view earnings.</p>
        </div>
        <Link
          to="/seller/service/new"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 gap-2"
        >
          <i className="fa-solid fa-plus"></i> Create New Service
        </Link>
      </div>

      {/* Stripe Connect Banner */}
      {!user.stripe_seller ? (
        <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md border border-white/20">
              <i className="fa-brands fa-stripe"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Connect with Stripe to get paid</h2>
              <p className="text-white/80 font-medium mt-1">Join our network of professionals and receive direct payouts to your bank account.</p>
            </div>
          </div>
          <a
            href={stripeOnboardingUrl}
            className="w-full md:w-auto px-10 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-lg text-center"
          >
            Connect Account
          </a>
        </div>
      ) : (
        <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <p className="text-green-800 font-bold">Stripe Account Linked</p>
            <p className="text-green-600 text-sm font-medium">Your account is ready to receive payments.</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Services" value={stats.totalServices} icon="fa-box" color="bg-blue-50 text-blue-600" />
        <StatCard title="Active Services" value={stats.activeServices} icon="fa-circle-check" color="bg-green-50 text-green-600" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon="fa-hourglass-half" color="bg-yellow-50 text-yellow-600" />
        <StatCard title="Completed" value={stats.completedOrders} icon="fa-sparkles" color="bg-purple-50 text-purple-600" />
        <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} icon="fa-sack-dollar" color="bg-primary/5 text-primary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/seller/orders" className="text-primary font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <i className="fa-solid fa-inbox text-4xl mb-4 block opacity-20"></i>
                <p>No orders yet</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Buyer</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <Link to={`/order/${order._id}`} className="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                          {order.service?.title || 'N/A'}
                        </Link>
                        <span className="text-xs text-gray-400 font-medium">{new Date(order.created).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-6 text-gray-600 font-medium">{order.buyer?.name || 'N/A'}</td>
                      <td className="px-8 py-6 font-black text-gray-900 text-lg">${order.amount}</td>
                      <td className="px-8 py-6"><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* My Services */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">My Services</h2>
            <Link to="/seller/services" className="text-primary font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {services.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <i className="fa-solid fa-layer-group text-4xl mb-4 block opacity-20"></i>
                <p>No services yet. Create your first service!</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {services.slice(0, 5).map((service) => (
                    <tr key={service._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-gray-900 line-clamp-1">{service.title}</td>
                      <td className="px-8 py-6 font-black text-gray-900 text-lg">${service.price}</td>
                      <td className="px-8 py-6"><StatusBadge status={service.status} /></td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => navigate(`/seller/service/edit/${service._id}`)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 group hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
    </div>
  )
}
