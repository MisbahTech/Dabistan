import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <section className="card">
      <h3>Welcome back, {user?.name}</h3>
      <p className="muted">
        {user?.role === 'admin'
          ? 'Manage posts, uploads, and editor accounts from the sidebar.'
          : 'Manage posts and uploads from the sidebar.'}
      </p>
    </section>
  )
}
