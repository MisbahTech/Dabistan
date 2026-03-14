const TOKEN_KEY = 'dabistan_admin_token'

// Connection helper: read token from localStorage.
export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

// Connection helper: persist token after login.
export function setAuthToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

// Connection helper: remove token on logout or auth failure.
export function clearAuthToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}
