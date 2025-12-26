const create = async (params, credentials, orderData) => {
  try {
    let response = await fetch('/api/orders/' + params.userId, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(orderData)
    })
    return response.json()
  } catch (err) {
    console.debug(err)
  }
}

const listByBuyer = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/orders/user/' + params.userId, {
      method: 'GET',
      credentials: 'include',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return response.json()
  } catch (err) {
    console.debug(err)
  }
}

const listBySeller = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/orders/seller/' + params.userId, {
      method: 'GET',
      credentials: 'include',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return response.json()
  } catch (err) {
    console.debug(err)
  }
}

const updateStatus = async (params, credentials, statusData) => {
  try {
    let response = await fetch('/api/order/' + params.orderId + '/status', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(statusData)
    })
    return response.json()
  } catch (err) {
    console.debug(err)
  }
}

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/order/' + params.orderId, {
      method: 'GET',
      credentials: 'include',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': credentials?.t ? ('Bearer ' + credentials.t) : undefined
      }
    })
    return response.json()
  } catch (err) {
    console.debug(err)
  }
}

export {
  create,
  listByBuyer,
  listBySeller, read, updateStatus
}

