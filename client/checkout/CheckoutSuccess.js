import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function CheckoutSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 text-center animate-in zoom-in-95 duration-500">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner shadow-green-200/50">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-black text-gray-900 mb-4">Payment Confirmed!</h1>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          Your order has been placed successfully. The seller has been notified and will begin working once they review your requirements.
        </p>

        {orderId && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Identifier</p>
            <p className="text-sm font-bold text-primary font-mono select-all">#{orderId}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/myorders')}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Track My Order
          </button>

          <Link
            to="/"
            className="block w-full py-4 text-gray-400 font-bold hover:text-primary transition-colors text-sm"
          >
            Return to Marketplace
          </Link>
        </div>

        {/* Success Message for Trust */}
        <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center gap-3 text-gray-400">
          <i className="fa-solid fa-shield-halved text-green-500/50"></i>
          <span className="text-xs font-bold uppercase tracking-widest">Secure Transaction</span>
        </div>
      </div>
    </div>
  )
}

