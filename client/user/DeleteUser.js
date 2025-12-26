import PropTypes from 'prop-types'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import auth from './../auth/auth-helper'
import { remove } from './api-user.js'

export default function DeleteUser(props) {
  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const jwt = auth.isAuthenticated()
  const clickButton = () => {
    setOpen(true)
  }
  const deleteAccount = () => {
    remove({
      userId: props.userId
    }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        console.debug(data.error)
      } else {
        auth.clearJWT(() => console.debug('deleted'))
        setRedirect(true)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }

  if (redirect) {
    return <Navigate to='/' replace />
  }

  return (
    <>
      <button
        onClick={clickButton}
        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold transition-colors text-sm"
      >
        <span className="text-lg">🗑️</span> Delete Account
      </button>

      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                💔
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Delete Account?</h2>
              <p className="text-gray-500">
                Are you sure you want to permanently delete your account? This action cannot be undone.
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
                onClick={deleteAccount}
                className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-xl shadow-red-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}
