import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import auth from './../auth/auth-helper'
import { read, update } from './api-user.js'

export default function EditProfile() {
  const { userId } = useParams()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    seller: false,
    bio: '',
    skills: '',
    languages: '',
    redirectToProfile: false,
    error: ''
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: userId
    }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({
          ...values,
          name: data.name,
          email: data.email,
          seller: data.seller,
          bio: data.sellerProfile?.bio || '',
          skills: data.sellerProfile?.skills?.join(', ') || '',
          languages: data.sellerProfile?.languages?.join(', ') || ''
        })
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [userId])

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      seller: values.seller,
      sellerProfile: {
        bio: values.bio,
        skills: values.skills.split(',').map(s => s.trim()).filter(s => s),
        languages: values.languages.split(',').map(l => l.trim()).filter(l => l)
      }
    }
    update({
      userId: userId
    }, {
      t: jwt.token
    }, user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        auth.updateUser(data, () => {
          setValues({ ...values, redirectToProfile: true })
        })
      }
    })
  }

  const handleChange = name => event => {
    const value = name === 'seller' ? event.target.checked : event.target.value
    setValues({ ...values, [name]: value })
  }

  if (values.redirectToProfile) {
    return <Navigate to={'/user/' + userId} replace />
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8 md:p-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Edit Your Profile</h2>
          <p className="text-gray-500">Update your personal information and seller profile.</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 label-modern">Full Name</label>
              <input
                className="input-field mt-1"
                value={values.name}
                onChange={handleChange('name')}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 label-modern">Email Address</label>
              <input
                type="email"
                className="input-field mt-1"
                value={values.email}
                onChange={handleChange('email')}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 label-modern">New Password (leave blank to keep current)</label>
            <input
              type="password"
              className="input-field mt-1"
              value={values.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Seller Account</h3>
                <p className="text-sm text-gray-500">Enable this to offer services on the marketplace.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.seller}
                  onChange={handleChange('seller')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {values.seller && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 label-modern">Professional Bio</label>
                  <textarea
                    rows="4"
                    className="input-field mt-1 resize-none"
                    value={values.bio}
                    onChange={handleChange('bio')}
                    placeholder="Tell potential buyers about your experience and methodology..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 label-modern">Skills (separated by commas)</label>
                  <input
                    className="input-field mt-1"
                    value={values.skills}
                    onChange={handleChange('skills')}
                    placeholder="React, Node.js, UI/UX Design..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 label-modern">Languages (separated by commas)</label>
                  <input
                    className="input-field mt-1"
                    value={values.languages}
                    onChange={handleChange('languages')}
                    placeholder="English, Spanish, French..."
                  />
                </div>
              </div>
            )}
          </div>

          {values.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium animate-pulse">
              ⚠️ {values.error}
            </div>
          )}

          <div className="pt-6 flex flex-col md:flex-row gap-4">
            <button
              onClick={clickSubmit}
              className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
            >
              Save Changes
            </button>
            <button
              onClick={() => setValues({ ...values, redirectToProfile: true })}
              className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
