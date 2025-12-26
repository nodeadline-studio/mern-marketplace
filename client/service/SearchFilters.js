import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const CATEGORIES = [
  'All Categories',
  'Design',
  'Development',
  'Writing',
  'Marketing',
  'Video',
  'Music',
  'Business',
  'Other'
]

const DELIVERY_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1 day', value: 1 },
  { label: '3 days', value: 3 },
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 }
]

export default function SearchFilters({ onFilterChange }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')

  useEffect(() => {
    const filters = {}
    if (search) filters.search = search
    if (category && category !== 'All Categories') filters.category = category
    if (minPrice) filters.minPrice = minPrice
    if (maxPrice) filters.maxPrice = maxPrice
    if (deliveryTime) filters.deliveryTime = deliveryTime

    if (onFilterChange) {
      onFilterChange(filters)
    }
  }, [search, category, minPrice, maxPrice, deliveryTime, onFilterChange])

  const handleReset = () => {
    setSearch('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setDeliveryTime('')
  }

  return (
    <div className="search-filters">
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-row">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat === 'All Categories' ? '' : cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-row price-row">
        <input
          type="number"
          placeholder="Min $"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="price-input"
          min="0"
        />
        <span className="price-sep">to</span>
        <input
          type="number"
          placeholder="Max $"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="price-input"
          min="0"
        />
      </div>

      <div className="filter-row">
        <select
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          className="filter-select"
        >
          {DELIVERY_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              Delivery: {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleReset} className="reset-btn">
        Reset Filters
      </button>

      <style>{`
        .search-filters {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
        }
        .filter-row {
          margin-bottom: 12px;
        }
        .search-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
        }
        .filter-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }
        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .price-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }
        .price-sep {
          color: #6b7280;
        }
        .reset-btn {
          width: 100%;
          padding: 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          color: #4b5563;
        }
        .reset-btn:hover {
          background: #e5e7eb;
        }
      `}</style>
    </div>
  )
}

SearchFilters.propTypes = {
  onFilterChange: PropTypes.func
}
