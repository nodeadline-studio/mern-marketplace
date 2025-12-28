import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCategories } from './api-service.js'

export default function Categories() {
  const [categories, setCategories] = useState([])

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <Link
        to="/services"
        className="group p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:bg-primary/10 hover:border-primary/20 transition-all"
      >
        <span className="block text-2xl mb-2"><i className="fa-solid fa-globe"></i></span>
        <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">All Services</span>
      </Link>

      {categories.map((item, i) => (
        <Link
          key={i}
          to={"/services/category/" + item}
          className="group p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:bg-primary/10 hover:border-primary/20 transition-all"
        >
          <span className="block text-2xl mb-2">
            {/* Font Awesome mapping for categories */}
            {item.toLowerCase().includes('design') ? <i className="fa-solid fa-palette"></i> :
              item.toLowerCase().includes('code') ? <i className="fa-solid fa-laptop"></i> :
                item.toLowerCase().includes('write') ? <i className="fa-solid fa-pen-nib"></i> :
                  item.toLowerCase().includes('video') ? <i className="fa-solid fa-video"></i> : <i className="fa-solid fa-folder-open"></i>}
          </span>
          <span className="font-bold text-gray-700 group-hover:text-primary transition-colors capitalize">{item}</span>
        </Link>
      ))}
    </div>
  )
}
