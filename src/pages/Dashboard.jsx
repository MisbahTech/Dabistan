import { useAuth } from '../context/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()
  const roleSlug = user?.role?.slug || user?.role
  const displayName = user?.name || user?.email || 'User'

  return (
    <section className="card">
      <h3>Welcome back, {displayName}</h3>
      <p className="muted">
        {roleSlug === 'admin'
          ? 'Manage posts, uploads, users, and permissions from the sidebar.'
          : 'Manage posts, uploads, and content updates from the sidebar.'}
      </p>
    </section>
  )
}
