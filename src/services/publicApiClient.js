import { API_BASE_URL } from '../config/apiConfig'

async function parseResponse(response) {
  if (!response.ok) {
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

export async function getPublicJSON(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    ...options,
  })

  return parseResponse(response)
}
