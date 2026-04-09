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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: buildHeaders({
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    }),
    ...options,
  })

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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: formData,
  })

  return parseResponse(response)
}
