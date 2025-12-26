// Client-side API configuration
// Uses environment variable REACT_APP_API_URL or defaults to localhost:5000/api
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export { API }
