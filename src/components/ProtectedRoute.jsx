import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { status, user } = useAuth()

  if (status === 'checking') {
    return <div className="page-loading">Checking session...</div>
  }

  if (status !== 'authed') {
    return <Navigate to="/login" replace />
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
