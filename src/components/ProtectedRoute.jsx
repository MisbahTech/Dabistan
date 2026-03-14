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

  const userRole = user?.role?.slug || user?.role
  if (roles?.length && !roles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
