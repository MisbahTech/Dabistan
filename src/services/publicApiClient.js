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
  const url = `${API_BASE_URL}${path}`
  let response

  try {
    response = await fetch(url, {
      method: 'GET',
      ...options,
    })
  } catch (error) {
    console.error('Public API request failed', { url, method: 'GET', error })
    throw new Error(`Unable to reach API: ${url}`)
  }

  return parseResponse(response)
}
