import { useState } from 'react'
import auth from './../auth/auth-helper'
import { remove } from './api-service.js'

export default function DeleteService({ serviceId, userId, onDeleted }) {
  const [open, setOpen] = useState(false)
  const jwt = auth.isAuthenticated()

  const clickButton = () => {
    setOpen(true)
  }

  const deleteService = () => {
    remove({
      serviceId: serviceId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data && data.error) {
        console.debug(data.error)
      } else {
        setOpen(false)
        if (onDeleted) {
          onDeleted(serviceId)
        }
      }
    })
  }

  const handleRequestClose = () => {
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={clickButton}
        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all shadow-sm flex items-center justify-center"
      >
        🗑️
      </button>

      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                ⚠️
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Delete Service?</h2>
              <p className="text-gray-500">
                Are you sure you want to delete this service? This action cannot be undone.
              </p>
            </div>

            <div className="p-8 border-t border-gray-50 flex gap-4">
              <button
                onClick={handleRequestClose}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteService}
                className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-xl shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
