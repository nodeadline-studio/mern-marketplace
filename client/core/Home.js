import { useEffect, useState } from 'react'
import { listCategories, listLatest } from './../service/api-service.js'
import Categories from './../service/Categories'
import Search from './../service/Search'
import Suggestions from './../service/Suggestions'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listLatest(signal).then((data) => {
      if (data && data.error) {
        console.debug(data.error)
      } else {
        setSuggestions(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listCategories(signal).then((data) => {
      if (data && data.error) {
        console.debug(data.error)
      } else {
        setCategories(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Search and Categories */}
        <div className="lg:w-2/3 space-y-8">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-10 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Find the perfect <span className="text-primary-light">service</span> for your business.
              </h1>
              <p className="text-lg text-primary-light/90 mb-8 max-w-xl">
                Connect with professional freelancers and get your projects done faster.
              </p>
              <Search categories={categories} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
              <button className="text-primary font-semibold text-sm hover:underline">View All</button>
            </div>
            <Categories categories={categories} />
          </div>
        </div>

        {/* Right Column: Suggestions/Latest */}
        <div className="lg:w-1/3">
          <Suggestions services={suggestions} title="Latest Services" />
        </div>
      </div>
    </div>
  )
}


