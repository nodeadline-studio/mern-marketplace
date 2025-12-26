import { useLocation, useNavigate } from 'react-router-dom'

export default function CheckoutFailure() {
  const navigate = useNavigate()
  const location = useLocation()
  const errorMessage = location.state?.error || 'Something went wrong with your payment.'

  return (
    <div className="checkout-result">
      <div className="result-card failure">
        <div className="icon">✕</div>
        <h1>Payment Failed</h1>
        <p>{errorMessage}</p>
        <div className="actions">
          <button onClick={() => navigate(-1)} className="primary-btn">
            Try Again
          </button>
          <button onClick={() => navigate('/')} className="secondary-btn">
            Back to Home
          </button>
        </div>
      </div>

      <style>{`
        .checkout-result {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .result-card {
          text-align: center;
          padding: 48px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 400px;
        }
        .result-card.failure .icon {
          width: 64px;
          height: 64px;
          background: #ef4444;
          color: white;
          font-size: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        .result-card h1 {
          font-size: 24px;
          color: #111827;
          margin-bottom: 12px;
        }
        .result-card p {
          color: #6b7280;
          margin-bottom: 24px;
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .primary-btn {
          padding: 12px 24px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .primary-btn:hover {
          background: #4338ca;
        }
        .secondary-btn {
          padding: 12px 24px;
          background: transparent;
          color: #4f46e5;
          border: 1px solid #4f46e5;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .secondary-btn:hover {
          background: #f5f3ff;
        }
      `}</style>
    </div>
  )
}
