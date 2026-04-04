import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useForgotPasswordMutation, useResetPasswordMutation } from '../services/authApi'
import siteLogo from '../assets/logo.png'

const emptyLogin = { email: '', password: '' }
const emptyReset = { email: '', otp: '', newPassword: '', confirmPassword: '' }

export default function LoginPage() {
  const { login, logout, status: authStatus } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [roleChoice, setRoleChoice] = useState('admin')
  const [form, setForm] = useState(emptyLogin)
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

  const handleLogin = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')
    setMessage('')
    try {
      const user = await login(form.email, form.password)
      if (roleChoice && user.role !== roleChoice) {
        logout()
        throw new Error(`This account is not an ${roleChoice}.`)
      }
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
      await forgotMutation.mutateAsync({ email: resetForm.email })
      setMessage('OTP sent. Check your email for the 6-digit code.')
      setMode('reset')
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
        email: resetForm.email,
        otp: resetForm.otp,
        newPassword: resetForm.newPassword,
      })
      setMessage('Password reset. You can now sign in.')
      setMode('login')
      setForm((prev) => ({ ...prev, email: resetForm.email, password: '' }))
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
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </label>
              <div className="role-toggle">
                <span>Login as</span>
                <div className="role-options">
                  {['admin', 'editor'].map((role) => (
                    <label key={role} className={`role-option ${roleChoice === role ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="roleChoice"
                        value={role}
                        checked={roleChoice === role}
                        onChange={() => setRoleChoice(role)}
                      />
                      {role === 'admin' ? 'Admin' : 'Editor'}
                    </label>
                  ))}
                </div>
              </div>
              {error ? <div className="alert error">{error}</div> : null}
              {message ? <div className="alert">{message}</div> : null}
              <button className="btn primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Signing in...' : 'Login'}
              </button>
              <button
                className="link"
                type="button"
                onClick={() => {
                  setMode('forgot')
                  setError('')
                  setMessage('')
                }}
              >
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
              <button
                className="link"
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setMessage('')
                }}
              >
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
                  value={resetForm.email}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>OTP Code</span>
                <input
                  type="text"
                  value={resetForm.otp}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, otp: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>New Password</span>
                <input
                  type="password"
                  value={resetForm.newPassword}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  value={resetForm.confirmPassword}
                  onChange={(event) => setResetForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  required
                />
              </label>
              {error ? <div className="alert error">{error}</div> : null}
              {message ? <div className="alert">{message}</div> : null}
              <button className="btn primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Updating...' : 'Reset Password'}
              </button>
              <button
                className="link"
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setMessage('')
                }}
              >
                Back to login
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}

