import { API } from '../../config'

export const create = (userId, token, service) => {
  return fetch(`${API}/services/by/${userId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: service
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const list = (params = {}, signal) => {
  const query = Object.keys(params)
    .filter(k => params[k])
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
  const url = query ? `${API}/services?${query}` : `${API}/services`
  return fetch(url, {
    method: 'GET',
    signal: signal
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const read = (params, signal) => {
  return fetch(`${API}/services/${params.serviceId}`, {
    method: 'GET',
    signal: signal
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const update = (serviceId, userId, token, service) => {
  return fetch(`${API}/services/${serviceId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(service)
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const remove = (params, credentials) => {
  return fetch(`${API}/services/${params.serviceId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.t}`
    }
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const listBySeller = (params, signal) => {
  return fetch(`${API}/services/by/${params.userId}`, {
    method: 'GET',
    signal: signal
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const listCategories = (signal) => {
  return fetch(`${API}/services/categories`, {
    method: 'GET',
    signal: signal
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const listFeatured = (signal) => {
  return fetch(`${API}/services/featured`, {
    method: 'GET',
    signal: signal
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const listLatest = (signal) => {
  return fetch(`${API}/services/latest`, {
    method: 'GET',
    signal: signal
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const listRelated = (params, signal) => {
  return fetch(`${API}/services/related/${params.serviceId}`, {
    method: 'GET',
    signal: signal
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}

export const search = (params) => {
  const query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
  return fetch(`${API}/services/search?${query}`, {
    method: 'GET'
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.debug(err))
}
