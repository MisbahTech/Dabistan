import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import siteLogo from '../assets/logo.png'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'editor'] },
  { to: '/posts', label: 'Posts', roles: ['admin', 'editor'] },
  { to: '/categories', label: 'Categories', roles: ['admin', 'editor'] },
  { to: '/videos', label: 'Videos', roles: ['admin', 'editor'] },
  { to: '/most-read', label: 'Most Read', roles: ['admin', 'editor'] },
  { to: '/weather', label: 'Weather Cache', roles: ['admin', 'editor'] },
  { to: '/exchange-rates', label: 'Exchange Rates', roles: ['admin', 'editor'] },
  { to: '/users', label: 'Users', roles: ['admin'] },
  { to: '/roles', label: 'Roles', roles: ['admin'] },
  { to: '/permissions', label: 'Permissions', roles: ['admin'] },
]

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()

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
            .filter((item) => {
              const userRole = user?.role?.slug || user?.role
              return item.roles.includes(userRole)
            })
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div>
            <h2>{user?.role?.name || 'Dashboard'}</h2>
            <p>{user?.email}</p>
          </div>
          <button className="btn ghost" type="button" onClick={logout}>
            Logout
          </button>
        </header>
        <main className="content-area">{children}</main>
      </div>
    </div>
  )
}

