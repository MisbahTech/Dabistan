import { useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/authApi'
import { AuthContext } from './authContextStore'
import { clearAuthToken, getAuthToken, setAuthToken } from '../services/authStore'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(() => (getAuthToken() ? 'checking' : 'guest'))

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      return
    }

    authApi
      .me()
      .then((data) => {
        setUser(data.user)
        setStatus('authed')
      })
      .catch(() => {
        clearAuthToken()
        setUser(null)
        setStatus('guest')
      })
  }, [])

  const login = async (email, password, role) => {
    const data = await authApi.login({ email, password, role })
    setAuthToken(data.token)
    setUser(data.user)
    setStatus('authed')
    return data.user
  }

  const logout = () => {
    clearAuthToken()
    setUser(null)
    setStatus('guest')
  }

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthed: status === 'authed',
      login,
      logout,
    }),
    [user, status]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
