import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

// Star Rating Component
function StarRating({ rating, onRatingChange, readonly = false, size = 24 }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{ fontSize: size }}
        >
          <i className="fa-solid fa-star"></i>
        </span>
      ))}
      <style>{`
        .star-rating {
          display: inline-flex;
          gap: 2px;
        }
        .star {
          color: #d1d5db;
          cursor: default;
          transition: color 0.15s;
        }
        .star:not(.readonly) {
          cursor: pointer;
        }
        .star.filled {
          color: #fbbf24;
        }
        .star:not(.readonly):hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.number
}

// Review Form Component
export function ReviewForm({ serviceId, orderId, onSuccess }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ serviceId, orderId, rating, comment })
      })

      const result = await response.json()
      if (result.error) {
        setError(result.error)
      } else {
        if (onSuccess) onSuccess(result)
        setRating(0)
        setComment('')
      }
    } catch (err) {
      setError('Failed to submit review')
    }

    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label>Your Rating</label>
        <StarRating rating={rating} onRatingChange={setRating} size={32} />
      </div>

      <div className="form-group">
        <label htmlFor="comment">Your Review (optional)</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          maxLength={500}
          rows={4}
        />
        <span className="char-count">{comment.length}/500</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={submitting || rating === 0}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>

      <style>{`
        .review-form {
          padding: 24px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          resize: vertical;
          font-family: inherit;
        }
        .char-count {
          font-size: 12px;
          color: #9ca3af;
          display: block;
          text-align: right;
        }
        .error-message {
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 16px;
        }
        .review-form button {
          width: 100%;
          padding: 12px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .review-form button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  )
}

ReviewForm.propTypes = {
  serviceId: PropTypes.string.isRequired,
  orderId: PropTypes.string,
  onSuccess: PropTypes.func
}

// Review List Component
export function ReviewList({ serviceId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [reviewsRes, statsRes] = await Promise.all([
          fetch(`/api/reviews/service/${serviceId}`),
          fetch(`/api/reviews/stats/${serviceId}`)
        ])
        const reviewsData = await reviewsRes.json()
        const statsData = await statsRes.json()
        setReviews(reviewsData)
        setStats(statsData)
      } catch (err) {
        console.debug('Failed to fetch reviews:', err)
      }
      setLoading(false)
    }

    if (serviceId) fetchReviews()
  }, [serviceId])

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>
  }

  return (
    <div className="review-list">
      {stats && (
        <div className="review-stats">
          <div className="average-rating">
            <span className="rating-value">{stats.averageRating}</span>
            <StarRating rating={Math.round(stats.averageRating)} readonly size={20} />
            <span className="total-reviews">{stats.totalReviews} reviews</span>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews">
          {reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <span className="reviewer-name">{review.buyer?.name || 'Anonymous'}</span>
                <StarRating rating={review.rating} readonly size={16} />
              </div>
              {review.comment && <p className="review-comment">{review.comment}</p>}
              {review.sellerResponse && (
                <div className="seller-response">
                  <strong>Seller Response:</strong>
                  <p>{review.sellerResponse}</p>
                </div>
              )}
              <span className="review-date">
                {new Date(review.created).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .review-list {
          padding: 24px;
        }
        .review-stats {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        .average-rating {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rating-value {
          font-size: 36px;
          font-weight: 700;
          color: #111827;
        }
        .total-reviews {
          color: #6b7280;
        }
        .no-reviews {
          color: #6b7280;
          text-align: center;
          padding: 24px;
        }
        .review-item {
          padding: 16px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .review-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .reviewer-name {
          font-weight: 600;
          color: #111827;
        }
        .review-comment {
          color: #374151;
          margin-bottom: 8px;
        }
        .seller-response {
          background: #f9fafb;
          padding: 12px;
          border-radius: 6px;
          margin-top: 8px;
        }
        .seller-response p {
          margin: 4px 0 0 0;
          color: #4b5563;
        }
        .review-date {
          font-size: 12px;
          color: #9ca3af;
        }
        .reviews-loading {
          text-align: center;
          padding: 24px;
          color: #6b7280;
        }
      `}</style>
    </div>
  )
}

ReviewList.propTypes = {
  serviceId: PropTypes.string.isRequired
}

export { StarRating }
