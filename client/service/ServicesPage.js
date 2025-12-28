import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { list, listCategories } from './api-service'
import Categories from './Categories'
import Search from './Search'
import SearchFilters from './SearchFilters'
import Services from './Services'

export default function ServicesPage() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  // Load categories on mount
  useEffect(() => {
    const abortController = new AbortController()
    listCategories(abortController.signal).then((data) => {
      if (data && !data.error) {
        setCategories(data)
      }
    })
    return () => abortController.abort()
  }, [])

  // Load services based on filters
  useEffect(() => {
    const abortController = new AbortController()
    setLoading(true)
    setError(null)

    const params = {}
    if (category && category !== 'all') {
      params.category = category
    }
    if (searchQuery) {
      params.search = searchQuery
    }

    list(params, abortController.signal).then((data) => {
      setLoading(false)
      if (data && data.error) {
        setError(data.error)
      } else {
        setServices(data || [])
        setSearched(true)
      }
    })

    return () => abortController.abort()
  }, [category, searchQuery])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category ? `${category} Services` : 'Browse Services'}
        </h1>
        <p className="text-gray-600">
          {category
            ? `Find the best ${category.toLowerCase()} freelancers`
            : 'Discover professional services from talented freelancers'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Search</h3>
            <Search categories={categories} />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <Categories categories={categories} />
          </div>

          {categories.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Filters</h3>
              <SearchFilters categories={categories} />
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="lg:w-3/4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
              <span className="text-4xl block mb-2"><i className="fa-solid fa-triangle-exclamation"></i></span>
              <p>{error}</p>
            </div>
          ) : (
            <Services services={services} searched={searched} />
          )}
        </main>
      </div>
    </div>
  )
}
