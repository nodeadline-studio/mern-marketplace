import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function CheckoutFailure() {
  const navigate = useNavigate()
  const location = useLocation()
  const errorMessage = location.state?.error || 'Something went wrong with your payment.'

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 text-center animate-in zoom-in-95 duration-500">
        {/* Failure Icon */}
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner shadow-red-200/50">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-black text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          {errorMessage}
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="block w-full py-4 text-gray-400 font-bold hover:text-primary transition-colors text-sm"
          >
            Return to Marketplace
          </Link>
        </div>

        {/* Help Message */}
        <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center gap-3 text-gray-400">
          <i className="fa-solid fa-circle-question text-gray-300"></i>
          <span className="text-xs font-bold uppercase tracking-widest">Need Support?</span>
        </div>
      </div>
    </div>
  )
}

