import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import LoginPage from './pages/Login'
import PublicHomePage from './pages/PublicHome'
import PublicPostPage from './pages/PublicPost'
import GalleryPage from './pages/Gallery'
import DashboardPage from './pages/Dashboard'
import PostsPage from './pages/Posts'
import CategoriesPage from './pages/Categories'
import VideosPage from './pages/Videos'
import MostReadPage from './pages/MostRead'
import WeatherPage from './pages/Weather'
import ExchangeRatesPage from './pages/ExchangeRates'
import UsersPage from './pages/Users'
import RolesPage from './pages/Roles'
import PermissionsPage from './pages/Permissions'
import NotFoundPage from './pages/NotFound'
import './styles/App.css'

// This file is the frontend route map.
// Think of it as the app's traffic controller:
// each URL is matched here, then routed either to
// public pages or to admin pages behind auth checks.
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/post/:slug" element={<PublicPostPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* /admin is only a convenience entry.
            Once auth passes, users are redirected to the real dashboard route. */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        {/* ProtectedRoute handles authentication first.
            DashboardLayout then wraps the actual page with the admin shell. */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Role-based checks happen at route level so unauthorized pages never render. */}
        <Route
          path="/posts"
          element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <DashboardLayout>
                <PostsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <DashboardLayout>
                <CategoriesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/videos"
          element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <DashboardLayout>
                <VideosPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/most-read"
          element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <DashboardLayout>
                <MostReadPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <DashboardLayout>
                <WeatherPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exchange-rates"
          element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <DashboardLayout>
                <ExchangeRatesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <RolesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/permissions"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <PermissionsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}
