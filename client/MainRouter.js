import { Route, Routes } from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import Signin from './auth/Signin'
import CheckoutFailure from './checkout/CheckoutFailure'
import CheckoutSuccess from './checkout/CheckoutSuccess'
import Home from './core/Home'
import Menu from './core/Menu'
import MyOrders from './order/MyOrders'
import Order from './order/Order'
import SellerDashboard from './seller/SellerDashboard'
import EditService from './service/EditService'
import NewService from './service/NewService'
import Service from './service/Service'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import Signup from './user/Signup'
import Users from './user/Users'

const MainRouter = () => {
  return (
    <>
      <Menu />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Profile Routes */}
        <Route path="/user/edit/:userId" element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        } />
        <Route path="/user/:userId" element={<Profile />} />

        {/* Service Routes */}
        <Route path="/service/:serviceId" element={<Service />} />

        <Route path="/seller/:userId/services/new" element={
          <PrivateRoute>
            <NewService />
          </PrivateRoute>
        } />

        <Route path="/seller/:userId/services/:serviceId/edit" element={
          <PrivateRoute>
            <EditService />
          </PrivateRoute>
        } />

        {/* Seller Dashboard */}
        <Route path="/seller/dashboard" element={
          <PrivateRoute>
            <SellerDashboard />
          </PrivateRoute>
        } />

        {/* Order Routes */}
        <Route path="/order/:orderId" element={<Order />} />
        <Route path="/myorders" element={
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        } />

        {/* Checkout Routes */}
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/failure" element={<CheckoutFailure />} />
      </Routes>
    </>
  )
}

export default MainRouter
