import { useAuth } from '../context/useAuth'
import { usePostsQuery } from '../services/postsApi'
import { useCategoriesQuery } from '../services/categoriesApi'
import { useUsersQuery } from '../services/usersApi'
import { useVideosQuery } from '../services/videosApi'
import { Layout, Users, FileText, Video } from 'lucide-react'
import StatsCharts from '../components/StatsCharts'

export default function DashboardPage() {
  const { user } = useAuth()
  const roleSlug = user?.role?.slug || user?.role
  const displayName = user?.name || user?.email || 'User'

  // Fetching live counts for the dashboard
  const postsQuery = usePostsQuery({ pageSize: 1 })
  const categoriesQuery = useCategoriesQuery()
  const usersQuery = useUsersQuery()
  const videosQuery = useVideosQuery()

  // Robust data extraction
  const posts = postsQuery.data?.data ?? (Array.isArray(postsQuery.data) ? postsQuery.data : [])
  const users = usersQuery.data?.data ?? (Array.isArray(usersQuery.data) ? usersQuery.data : [])
  const videos = videosQuery.data?.data ?? (Array.isArray(videosQuery.data) ? videosQuery.data : [])
  const categories = categoriesQuery.data?.data ?? (Array.isArray(categoriesQuery.data) ? categoriesQuery.data : [])

  const adminCount = users.filter((u) => (u.role?.slug || u.role) === 'admin').length
  const authorCount = users.filter((u) => (u.role?.slug || u.role) === 'author').length
  const editorCount = users.filter((u) => (u.role?.slug || u.role) === 'editor').length

  const stats = [
    {
      label: 'Total Posts',
      value: posts.length,
      icon: FileText,
      footer: 'Latest updates',
      color: '#3b82f6',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: Layout,
      footer: 'Organized content',
      color: '#10b981',
    },
    {
      label: 'Total Users',
      value: users.length,
      icon: Users,
      footer: `${adminCount} Admins, ${authorCount} Authors`,
      color: '#f59e0b',
    },
    {
      label: 'Videos Library',
      value: videos.length,
      icon: Video,
      footer: 'Multimedia assets',
      color: '#ef4444',
    },
  ]

  return (
    <div className="stack">
      <section className="card">
        <h3>Welcome back, {displayName}</h3>
        <p className="muted">
          {roleSlug === 'admin'
            ? 'Manage posts, uploads, users, and permissions from your central hub.'
            : 'Manage posts, uploads, and content updates for the Dabistan community.'}
        </p>
      </section>

      <div className="stat-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <div className="stat-label">
              <stat.icon size={18} style={{ color: stat.color, marginBottom: '-3px', marginRight: '8px' }} />
              {stat.label}
            </div>
            <div className="stat-value">
              {postsQuery.isLoading ? '...' : stat.value}
            </div>
            <div className="stat-footer">{stat.footer}</div>
          </article>
        ))}
      </div>

      <StatsCharts posts={posts} users={users} categories={categories} />
    </div>
  )
}
