// Client-side API configuration.
// Use same-origin API by default so the UI works regardless of dev port (e.g. 5001).
// If needed, you can override by setting `window.API_URL` before the app bootstraps.
const API =
  (typeof window !== 'undefined' && window.API_URL) ? window.API_URL : '/api'

export { API }
