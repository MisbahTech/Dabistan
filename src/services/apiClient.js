import { API_BASE_URL } from '../config/apiConfig'
import { clearAuthToken, getAuthToken } from './authStore'

// Connection helper: normalize API responses and surface useful errors.

async function parseResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
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
      // ignore JSON parse errors
    }

    const message = `Request failed: ${response.status} ${response.statusText}${details}`
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

// Connection helper: inject auth token and custom headers.
function buildHeaders(extra = {}) {
  const token = getAuthToken()
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

// Connection helper: shared JSON request wrapper for the REST API.
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

// Connection: read-only request.
export function getJSON(path, options = {}) {
  return requestJSON(path, { method: 'GET', ...options })
}

// Connection: create request with JSON body.
export function postJSON(path, body, options = {}) {
  return requestJSON(path, { method: 'POST', body: JSON.stringify(body), ...options })
}

// Connection: update request with JSON body.
export function putJSON(path, body, options = {}) {
  return requestJSON(path, { method: 'PUT', body: JSON.stringify(body), ...options })
}

// Connection: delete request.
export function deleteJSON(path, options = {}) {
  return requestJSON(path, { method: 'DELETE', ...options })
}

// Connection: file upload using multipart form data.
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
