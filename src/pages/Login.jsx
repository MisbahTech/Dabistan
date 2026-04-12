import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useForgotPasswordMutation, useResetPasswordMutation } from '../services/authApi'
import { ShieldCheck, Edit3, PenTool } from 'lucide-react'
import siteLogo from '../assets/logo.png'
import { getSavedEmail, setSavedEmail, getSavedRole, setSavedRole } from '../services/authStore'

const ROLES = [
  { id: 'admin', label: 'Admin', icon: ShieldCheck, color: '#1e3a5f' },
  { id: 'editor', label: 'Editor', icon: Edit3, color: '#0f172a' },
  { id: 'author', label: 'Author', icon: PenTool, color: '#10b981' },
]

const emptyLogin = { email: '', password: '' }
const emptyReset = { email: '', otp: '', newPassword: '', confirmPassword: '' }

export default function LoginPage() {
  const { login, status: authStatus } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [roleChoice, setRoleChoice] = useState(() => getSavedRole())
  const [form, setForm] = useState(() => ({ ...emptyLogin, email: getSavedEmail() }))
  const [resetForm, setResetForm] = useState(emptyReset)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const forgotMutation = useForgotPasswordMutation()
  const resetMutation = useResetPasswordMutation()

  useEffect(() => {
    if (authStatus === 'authed') {
      navigate('/dashboard', { replace: true })
    }
  }, [authStatus, navigate])

  const openMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setMessage('')
    if (nextMode !== 'login') {
      setResetForm((prev) => ({ ...prev, email: prev.email || form.email.trim() }))
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')
    setMessage('')
    try {
      await login(form.email.trim().toLowerCase(), form.password, roleChoice)
      
      // Persist email and role for next visit
      setSavedEmail(form.email.trim().toLowerCase())
      setSavedRole(roleChoice)
      
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  const handleSendOtp = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')
    setMessage('')
    try {
      const email = resetForm.email.trim()
      const result = await forgotMutation.mutateAsync({ email })
      // Clear OTP or set debug code to ensure the field is fresh for the user
      setResetForm((prev) => ({ ...prev, email, otp: result?.debugOtp ?? '' }))
      setMode('reset')
      setMessage(result?.debugOtp ? result.message + ' OTP: ' + result.debugOtp : result?.message || 'OTP sent successfully.')
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')
    setMessage('')
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError('Passwords do not match')
      setStatus('idle')
      return
    }
    try {
      await resetMutation.mutateAsync({
        email: resetForm.email.trim(),
        otp: resetForm.otp.trim(),
        newPassword: resetForm.newPassword,
      })
      setMessage('Password reset. You can now sign in.')
      setMode('login')
      setForm((prev) => ({ ...prev, email: resetForm.email.trim(), password: '' }))
      setResetForm(emptyReset)
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  return (
    <div className="login-page" dir="ltr">
      <div className="login-card">
        <aside className="login-brand">
          <img src={siteLogo} alt="Dabistan logo" />
          <h2>Dabistan</h2>
          <p>Secure admin and editor access to manage posts and content.</p>
        </aside>
        <div className="login-form">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="login-stack">
              <h1>Sign in</h1>
              <p className="muted">Enter your credentials to continue.</p>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  autoComplete="username"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </label>
              <div className="role-toggle">
                <span>Login as</span>
                <div className="role-options">
                  {ROLES.map((role) => (
                    <label key={role.id} className={`role-option ${roleChoice === role.id ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="roleChoice"
                        value={role.id}
                        checked={roleChoice === role.id}
                        onChange={() => setRoleChoice(role.id)}
                      />
                      <role.icon size={20} />
                      <span>{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {error ? <div className="alert error">{error}</div> : null}
              {message ? <div className="alert">{message}</div> : null}
              <button className="btn primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Signing in...' : 'Login'}
              </button>
              <button className="link" type="button" onClick={() => openMode('forgot')}>
                Forgot password?
              </button>
            </form>
          ) : null}

          {mode === 'forgot' ? (
            <form onSubmit={handleSendOtp} className="login-stack">
              <h1>Forgot password</h1>
              <p className="muted">Enter your email to receive a one-time code.</p>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={resetForm.email}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>
              {error ? <div className="alert error">{error}</div> : null}
              {message ? <div className="alert">{message}</div> : null}
              <button className="btn primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send OTP'}
              </button>
              <button className="link" type="button" onClick={() => openMode('login')}>
                Back to login
              </button>
            </form>
          ) : null}

          {mode === 'reset' ? (
            <form onSubmit={handleResetPassword} className="login-stack">
              <h1>Reset password</h1>
              <p className="muted">Enter the OTP sent to your email and set a new password.</p>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={resetForm.email}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>OTP Code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={resetForm.otp}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, otp: event.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  required
                />
              </label>
              <label>
                <span>New Password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={resetForm.newPassword}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={resetForm.confirmPassword}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  required
                />
              </label>
              {error ? <div className="alert error">{error}</div> : null}
              {message ? <div className="alert">{message}</div> : null}
              <div className="auth-actions-row">
                <button className="btn primary" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Updating...' : 'Reset Password'}
                </button>
                <button className="btn ghost" type="button" onClick={handleSendOtp} disabled={status === 'loading'}>
                  Resend OTP
                </button>
              </div>
              <button className="link" type="button" onClick={() => openMode('login')}>
                Back to login
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}
