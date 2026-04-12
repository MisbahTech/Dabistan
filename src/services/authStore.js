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

// Persistence helpers for better UX (remembering the last used email/role)
export function getSavedEmail() {
  return window.localStorage.getItem('dabistan_remember_email') || ''
}

export function setSavedEmail(email) {
  window.localStorage.setItem('dabistan_remember_email', email)
}

export function getSavedRole() {
  return window.localStorage.getItem('dabistan_remember_role') || 'admin'
}

export function setSavedRole(role) {
  window.localStorage.setItem('dabistan_remember_role', role)
}
