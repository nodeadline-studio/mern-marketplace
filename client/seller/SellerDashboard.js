import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import auth from '../auth/auth-helper'

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

  useEffect(() => {
    const jwt = auth.isAuthenticated()
    if (!jwt) {
      navigate('/signin')
      return
    }

    const fetchData = async () => {
      try {
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
          pendingOrders: ordersArr.filter(o => o.status === 'pending' || o.status === 'in_progress').length,
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

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="seller-dashboard">
      <header className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <button onClick={() => navigate('/seller/service/new')} className="new-service-btn">
          + New Service
        </button>
      </header>

      <div className="stats-grid">
        <StatCard title="Total Services" value={stats.totalServices} icon="📦" />
        <StatCard title="Active Services" value={stats.activeServices} icon="✅" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" />
        <StatCard title="Completed Orders" value={stats.completedOrders} icon="🎉" />
        <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} icon="💰" />
      </div>

      <section className="dashboard-section">
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="empty-message">No orders yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td>{order.service?.title || 'N/A'}</td>
                  <td>{order.buyer?.name || 'N/A'}</td>
                  <td>${order.amount}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{new Date(order.created).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="dashboard-section">
        <h2>My Services</h2>
        {services.length === 0 ? (
          <p className="empty-message">No services yet. Create your first service!</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.title}</td>
                  <td>${service.price}</td>
                  <td><StatusBadge status={service.status} /></td>
                  <td>{new Date(service.created).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/seller/service/edit/${service._id}`)}
                      className="action-btn"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <style>{`
        .seller-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .dashboard-header h1 {
          font-size: 28px;
          color: #111827;
        }
        .new-service-btn {
          padding: 12px 24px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .new-service-btn:hover {
          background: #4338ca;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .stat-card .icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .stat-card .value {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }
        .stat-card .title {
          font-size: 14px;
          color: #6b7280;
        }
        .dashboard-section {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
        }
        .dashboard-section h2 {
          font-size: 18px;
          color: #111827;
          margin-bottom: 16px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .data-table th {
          font-weight: 600;
          color: #374151;
          background: #f9fafb;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .status-badge.active,
        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }
        .status-badge.pending,
        .status-badge.in_progress {
          background: #fef3c7;
          color: #92400e;
        }
        .status-badge.draft,
        .status-badge.paused,
        .status-badge.cancelled {
          background: #f3f4f6;
          color: #4b5563;
        }
        .action-btn {
          padding: 6px 12px;
          background: #f3f4f6;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .action-btn:hover {
          background: #e5e7eb;
        }
        .empty-message {
          color: #6b7280;
          text-align: center;
          padding: 24px;
        }
        .dashboard-loading {
          text-align: center;
          padding: 48px;
          color: #6b7280;
        }
      `}</style>
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="icon">{icon}</div>
      <div className="value">{value}</div>
      <div className="title">{title}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
