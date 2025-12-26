import { Link, useLocation, useNavigate } from 'react-router-dom'
import auth from './../auth/auth-helper'

const Menu = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                S
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
                Service<span className="text-primary-light">Market</span>
              </span>
            </Link>

            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link to="/" className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive("/")}`}>
                Home
              </Link>
              <Link to="/users" className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive("/users")}`}>
                Freelancers
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {!auth.isAuthenticated() ? (
              <div className="flex items-center gap-4">
                <Link to="/signin" className="text-gray-600 hover:text-primary font-semibold text-sm transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-md active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                {auth.isAuthenticated().user.seller && (
                  <Link
                    to={`/seller/${auth.isAuthenticated().user._id}/services/new`}
                    className="hidden md:flex items-center gap-1 text-primary-dark font-bold text-sm bg-primary-light/20 px-4 py-2 rounded-lg hover:bg-primary-light/30 transition-colors"
                  >
                    <span>+</span> Create Service
                  </Link>
                )}

                <Link
                  to={"/user/" + auth.isAuthenticated().user._id}
                  className={`flex items-center gap-2 group ${isActive("/user/" + auth.isAuthenticated().user._id)}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors font-bold">
                    {auth.isAuthenticated().user.name.charAt(0)}
                  </div>
                  <span className="hidden lg:block text-sm font-semibold">{auth.isAuthenticated().user.name}</span>
                </Link>

                <Link
                  to="/myorders"
                  className={`text-sm font-semibold transition-colors ${isActive("/myorders")}`}
                >
                  My Orders
                </Link>

                <button
                  onClick={() => { auth.clearJWT(() => navigate('/')) }}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Menu
