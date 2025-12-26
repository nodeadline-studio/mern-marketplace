import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Suggestions(props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">
          {props.title}
        </h3>
      </div>

      <div className="divide-y divide-gray-50">
        {props.services.map((service, i) => (
          <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
              <Link to={"/service/" + service._id} className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                <img
                  className="w-full h-full object-cover"
                  src={'/api/service/image/' + service._id}
                  alt={service.title}
                />
              </Link>

              <div className="flex-grow flex flex-col justify-center">
                <Link
                  to={"/service/" + service._id}
                  className="text-gray-900 font-semibold text-sm line-clamp-2 hover:text-primary transition-colors"
                >
                  {service.title}
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-bold text-sm">$ {service.price}</span>
                  <span className="text-gray-400 text-xs">🕒 {service.deliveryTime}d</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

Suggestions.propTypes = {
  services: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
}
