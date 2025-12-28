import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import auth from './../auth/auth-helper'
import { create } from './api-service.js'

export default function NewService() {
  const { userId } = useParams()
  const [values, setValues] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    price: '',
    deliveryTime: '7',
    revisions: '1',
    requirements: '',
    tags: '',
    status: 'draft',
    featured: false,
    redirect: false,
    error: ''
  })
  const jwt = auth.isAuthenticated()

  const handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : name === 'featured'
        ? event.target.checked
        : event.target.value
    setValues({ ...values, [name]: value })
  }

  const clickSubmit = () => {
    let serviceData = new FormData()
    values.title && serviceData.append('title', values.title)
    values.description && serviceData.append('description', values.description)
    values.image && serviceData.append('image', values.image)
    values.category && serviceData.append('category', values.category)
    values.price && serviceData.append('price', values.price)
    values.deliveryTime && serviceData.append('deliveryTime', values.deliveryTime)
    values.revisions && serviceData.append('revisions', values.revisions)
    values.requirements && serviceData.append('requirements', values.requirements)
    values.tags && serviceData.append('tags', values.tags)
    values.status && serviceData.append('status', values.status)
    serviceData.append('featured', values.featured)

    create(userId, jwt.token, serviceData).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: '', redirect: true })
      }
    })
  }

  if (values.redirect) {
    return <Navigate to={'/user/' + userId} replace />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12 border-b border-gray-50 bg-gray-50/30">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create a New Service</h1>
          <p className="text-gray-500">Offer your skills to the world. Be detailed for better conversion.</p>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          {/* Image Upload Area */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative group">
            <input
              accept="image/*"
              onChange={handleChange('image')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="image-upload"
              type="file"
            />
            <div className="text-center">
              <span className="text-5xl mb-4 block">📸</span>
              <p className="text-gray-900 font-bold mb-1">Click to upload service image</p>
              <p className="text-gray-400 text-sm">Recommended: 1600x1200px (4:3)</p>
              {values.image && (
                <p className="mt-4 text-primary font-bold animate-bounce">
                  Selected: {values.image.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Service Title</label>
              <input
                className="input-field text-xl"
                value={values.title}
                onChange={handleChange('title')}
                placeholder="e.g. I will design a modern minimalist logo for your brand"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Description</label>
              <textarea
                rows="6"
                className="input-field resize-none"
                value={values.description}
                onChange={handleChange('description')}
                placeholder="Introduce your service, what's included, and why buyers should choose you..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Category</label>
              <select
                className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                value={values.category}
                onChange={handleChange('category')}
              >
                <option value="">Select Category</option>
                <option value="Web Design">Web Design</option>
                <option value="Writing">Writing</option>
                <option value="Programming">Programming</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Price ($)</label>
              <input
                type="number"
                className="input-field font-mono font-bold"
                value={values.price}
                onChange={handleChange('price')}
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Delivery Time (Days)</label>
              <input
                type="number"
                className="input-field"
                value={values.deliveryTime}
                onChange={handleChange('deliveryTime')}
                placeholder="7"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Revisions</label>
              <input
                type="number"
                className="input-field"
                value={values.revisions}
                onChange={handleChange('revisions')}
                placeholder="3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Requirements for Buyer</label>
              <textarea
                rows="3"
                className="input-field resize-none"
                value={values.requirements}
                onChange={handleChange('requirements')}
                placeholder="What information do you need from the buyer to start?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Tags (comma-separated)</label>
              <input
                className="input-field"
                value={values.tags}
                onChange={handleChange('tags')}
                placeholder="Logo, Minimalist, Branding..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 label-modern mb-2">Publishing Status</label>
              <select
                className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                value={values.status}
                onChange={handleChange('status')}
              >
                <option value="draft">Draft (Private)</option>
                <option value="active">Active (Visible)</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {values.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium animate-shake">
              <i className="fa-solid fa-triangle-exclamation"></i> {values.error}
            </div>
          )}

          <div className="pt-10 flex flex-col md:flex-row gap-4 border-t border-gray-50">
            <button
              onClick={clickSubmit}
              className="flex-1 bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
            >
              Create Service
            </button>
            <Link
              to={`/user/${userId}`}
              className="flex-1 bg-gray-100 text-gray-600 py-5 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
