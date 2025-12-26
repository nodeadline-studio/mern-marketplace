import { useState } from 'react'
import { Link } from 'react-router-dom'
import { create } from './api-user.js'

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: ''
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    }
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: '', open: true })
      }
    })
  }

  if (values.open) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-4xl mx-auto mb-6">
          ✓
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Aboard!</h2>
        <p className="text-gray-500 mb-8">Your account has been created successfully. You're ready to start exploring the marketplace.</p>
        <Link
          to="/signin"
          className="block w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          Sign In Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 font-medium">Join our community of professionals</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              className="input-field"
              placeholder="John Doe"
              value={values.name}
              onChange={handleChange('name')}
            />
          </div>
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
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
              ⚠️ {values.error}
            </div>
          )}

          <button
            onClick={clickSubmit}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
          >
            Create Account
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
