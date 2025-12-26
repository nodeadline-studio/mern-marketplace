import { useState } from 'react'
import { Link } from 'react-router-dom'
import { search } from './api-service.js'

export default function Search() {
  const [values, setValues] = useState({
    search: '',
    searched: false,
    results: []
  })

  const handleChange = event => {
    setValues({
      ...values,
      search: event.target.value,
    })
  }

  const searchServices = () => {
    if (values.search) {
      search({
        search: values.search || undefined
      }).then((data) => {
        if (data && data.error) {
          console.debug(data.error)
        } else {
          setValues({ ...values, results: data, searched: true })
        }
      })
    }
  }

  const enterKey = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      searchServices()
    }
  }

  return (
    <div className="w-full relative">
      <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 p-2 focus-within:ring-2 focus-within:ring-primary-light transition-all">
        <span className="pl-4 text-gray-400">🔍</span>
        <input
          type="text"
          className="w-full py-3 px-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none font-medium"
          placeholder="What service are you looking for today?"
          onChange={handleChange}
          onKeyDown={enterKey}
        />
        <button
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-md"
          onClick={searchServices}
        >
          Search
        </button>
      </div>

      {values.searched && values.results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <span className="text-gray-500 text-sm font-semibold">Found {values.results.length} services</span>
            <button
              onClick={() => setValues({ ...values, searched: false, results: [] })}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Clear
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {values.results.map((service, i) => (
              <Link
                key={i}
                to={"/service/" + service._id}
                className="block p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`/api/service/image/${service._id}`}
                    className="w-12 h-12 rounded-lg object-cover"
                    alt=""
                  />
                  <div>
                    <h4 className="text-gray-900 font-semibold group-hover:text-primary transition-colors">{service.title}</h4>
                    <p className="text-gray-500 text-xs">$ {service.price} • {service.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
