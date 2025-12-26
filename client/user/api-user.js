
const create = async (user) => {
  try {
    let response = await fetch('/api/users/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    return await response.json()
  } catch (err) {
    console.debug(err)
  }
}

const list = async (signal) => {
  try {
    let response = await fetch('/api/users/', {
      method: 'GET',
      credentials: 'include',
      signal: signal,
    })
    return await response.json()
  } catch (err) {
    console.debug(err)
  }
}

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'GET',
      credentials: 'include',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch (err) {
    console.debug(err)
  }
}

const update = async (params, credentials, user) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(user)
    })
    return await response.json()
  } catch (err) {
    console.debug(err)
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch (err) {
    console.debug(err)
  }
}

const stripeUpdate = async (params, credentials, auth_code, signal) => {
  try {
    let response = await fetch('/api/stripe_auth/' + params.userId, {
      method: 'PUT',
      credentials: 'include',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({ stripe: auth_code })
    })
    return await response.json()
  } catch (err) {
    console.debug(err)
  }
}

export {
  create,
  list,
  read, remove,
  stripeUpdate, update
}

