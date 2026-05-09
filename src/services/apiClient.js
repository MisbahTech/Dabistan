import { API_BASE_URL } from '../config/apiConfig'
import { clearAuthToken, getAuthToken } from './authStore'

async function parseResponse(response) {
  if (!response.ok) {
    const hasToken = Boolean(getAuthToken())
    if (response.status === 401 && hasToken) {
      clearAuthToken()
      window.location.href = '/login'
    }
    let details = ''
    try {
      const payload = await response.json()
      if (payload?.message) {
        details = ` - ${payload.message}`
      }
    } catch {
      details = ''
    }

    const message = `Request failed: ${response.status} ${response.statusText}${details}`
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function buildHeaders(extra = {}) {
  const token = getAuthToken()
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function requestJSON(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  let response

  try {
    response = await fetch(url, {
      headers: buildHeaders({
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      }),
      ...options,
    })
  } catch (error) {
    console.error('API request failed', { url, method: options.method ?? 'GET', error })
    throw new Error(`Unable to reach API: ${url}`)
  }

  return parseResponse(response)
}

export function getJSON(path, options = {}) {
  return requestJSON(path, { method: 'GET', ...options })
}

export function postJSON(path, body, options = {}) {
  return requestJSON(path, { method: 'POST', body: JSON.stringify(body), ...options })
}

export function putJSON(path, body, options = {}) {
  return requestJSON(path, { method: 'PUT', body: JSON.stringify(body), ...options })
}

export function deleteJSON(path, options = {}) {
  return requestJSON(path, { method: 'DELETE', ...options })
}

export async function postFile(path, file) {
  const formData = new FormData()
  formData.append('file', file)
  const url = `${API_BASE_URL}${path}`
  let response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(),
      body: formData,
    })
  } catch (error) {
    console.error('API file upload failed', { url, method: 'POST', error })
    throw new Error(`Unable to reach API: ${url}`)
  }

  return parseResponse(response)
}
