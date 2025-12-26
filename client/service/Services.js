import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Services(props) {
  return (
    <div className="w-full">
      {props.services && props.services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {props.services.map((service, i) => (
            <div key={i} className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
              <Link to={"/service/" + service._id} className="relative aspect-video overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={'/api/service/image/' + service._id}
                  alt={service.title}
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-end">
                    <span className="text-white font-bold text-xl drop-shadow-md">$ {service.price}</span>
                    <span className="text-gray-300 text-xs flex items-center gap-1">
                      🕒 {service.deliveryTime}d
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <Link
                    to={"/service/" + service._id}
                    className="text-gray-900 font-semibold text-lg line-clamp-1 hover:text-primary transition-colors"
                  >
                    {service.title}
                  </Link>
                  <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">{service.category}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <Link to={`/user/${service.seller._id}`} className="text-gray-600 text-xs hover:text-primary transition-colors flex items-center gap-1">
                    👤 {service.seller.name}
                  </Link>
                  <Link
                    to={"/service/" + service._id}
                    className="text-primary text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-transform"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : props.searched && (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🔍</span>
          <h4 className="text-2xl font-bold text-gray-400">No services found!</h4>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

Services.propTypes = {
  services: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired
}
