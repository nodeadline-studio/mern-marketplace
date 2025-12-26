import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import auth from './../auth/auth-helper'
import MyOrders from './../order/MyOrders'
import { read } from './api-user.js'
import DeleteUser from './DeleteUser'

export default function Profile() {
  const { userId } = useParams()
  const [user, setUser] = useState({ sellerProfile: {} })
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()
  const token = jwt ? jwt.token : null

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    read({
      userId: userId
    }, { t: token }, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [userId])

  if (redirectToSignin) {
    return <Navigate to='/signin' replace />
  }

  const isSelf = !!(jwt && jwt.user && jwt.user._id == user._id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header/Cover Area */}
        <div className="h-40 bg-gradient-to-r from-primary to-primary-dark relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-primary text-5xl font-bold">
                {user.name && user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                {user.name}
                {user.sellerProfile?.verified && (
                  <span className="text-blue-500 text-xl" title="Verified Seller">✅</span>
                )}
              </h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  Joined {new Date(user.created).toLocaleDateString()}
                </span>
                {user.seller && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                    Professional Seller
                  </span>
                )}
              </div>
            </div>

            {isSelf && (
              <div className="flex gap-2">
                <Link
                  to={"/user/edit/" + user._id}
                  className="p-2 text-gray-400 hover:text-primary transition-colors border border-gray-100 rounded-lg hover:bg-gray-50"
                  title="Edit Profile"
                >
                  <span className="text-xl">✏️</span>
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            )}
          </div>

          {/* Seller Profile Section */}
          {(user.seller || user.sellerProfile?.bio) && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-50 pt-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {user.sellerProfile?.bio || "This user hasn't added a bio yet."}
                  </p>
                </div>

                {user.sellerProfile?.skills?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.sellerProfile.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/5 text-primary text-sm font-semibold rounded-md border border-primary/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="text-center">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Seller Rating</p>
                  <div className="text-3xl font-extrabold text-gray-900">{user.sellerProfile?.rating || "0.0"}</div>
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
                <div className="flex justify-between text-sm py-3 border-y border-gray-200">
                  <span className="text-gray-500">Total Orders</span>
                  <span className="font-bold text-gray-900">{user.sellerProfile?.totalOrders || 0}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {user.sellerProfile?.languages?.map((lang, i) => (
                      <span key={i} className="text-gray-600 font-medium text-sm">{lang}{i < user.sellerProfile.languages.length - 1 ? ',' : ''}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <MyOrders />
        </div>
      </div>
    </div>
  )
}
