import {
  LayoutDashboard,
  FileText,
  Tags,
  Video,
  BarChart3,
  CloudSun,
  RefreshCw,
  Users,
  ShieldCheck,
  Key,
  LogOut
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'author'] },
  { to: '/posts', label: 'Posts', icon: FileText, roles: ['admin', 'editor', 'author'] },
  { to: '/categories', label: 'Categories', icon: Tags, roles: ['admin', 'editor', 'author'] },
  { to: '/videos', label: 'Videos', icon: Video, roles: ['admin', 'editor', 'author'] },
  { to: '/most-read', label: 'Most Read', icon: BarChart3, roles: ['admin', 'editor', 'author'] },
  { to: '/weather', label: 'Weather Cache', icon: CloudSun, roles: ['admin', 'editor'] },
  { to: '/exchange-rates', label: 'Exchange Rates', icon: RefreshCw, roles: ['admin', 'editor'] },
  { to: '/users', label: 'Users', icon: Users, roles: ['admin'] },
  { to: '/roles', label: 'Roles', icon: ShieldCheck, roles: ['admin'] },
  { to: '/permissions', label: 'Permissions', icon: Key, roles: ['admin'] },
]

import { NavLink } from 'react-router-dom'
import siteLogo from '../assets/logo.png'
import { useAuth } from '../context/useAuth'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const userRole = user?.role?.slug || user?.role
  const roleLabel = user?.role?.name || user?.roleName || 'Dashboard'

  return (
    <div className="app-shell" dir="ltr">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={siteLogo} alt="Dabistan" />
          <div>
            <h1>Dabistan</h1>
            <p>Admin Portal</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div>
            <h2>{roleLabel}</h2>
            <p>{user?.email}</p>
          </div>
          <button className="btn ghost" type="button" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <LogOut size={18} />
            Logout
          </button>
        </header>
        <main className="content-area">{children}</main>
      </div>
    </div>
  )
}
