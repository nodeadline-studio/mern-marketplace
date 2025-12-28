import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import auth from './../auth/auth-helper'
import { signin } from './api-auth.js'

export default function Signin() {
  const location = useLocation()
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false
  })

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }

    signin(user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '', redirectToReferrer: true })
        })
      }
    })
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const from = location.state?.from || { pathname: '/' }

  if (values.redirectToReferrer) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-medium">Log in to manage your services</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="john@example.com"
              value={values.email}
              onChange={handleChange('email')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange('password')}
            />
          </div>

          {values.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium animate-shake">
              <i className="fa-solid fa-triangle-exclamation"></i> {values.error}
            </div>
          )}

          <button
            onClick={clickSubmit}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
          >
            Sign In
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


