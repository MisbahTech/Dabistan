const DEFAULT_DEV_API_BASE_URL = 'http://localhost:8000/api'

function normalizeApiBaseUrl(value) {
  return String(value || '').trim().replace(/\/$/, '')
}

const configuredApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
const isProduction = import.meta.env.PROD
const isLocalApiBaseUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api$/i.test(configuredApiBaseUrl)
const isBrowserOnLocalhost =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
const defaultApiBaseUrl =
  typeof window !== 'undefined' && !isBrowserOnLocalhost ? '/api' : DEFAULT_DEV_API_BASE_URL

export const API_BASE_URL =
  configuredApiBaseUrl && (!isLocalApiBaseUrl || isBrowserOnLocalhost)
    ? configuredApiBaseUrl
    : isProduction
      ? '/api'
      : defaultApiBaseUrl

if (isProduction && !configuredApiBaseUrl) {
  console.error('Missing VITE_API_BASE_URL. Set it to your deployed HTTPS backend URL, ending with /api.')
}

if (isProduction && isLocalApiBaseUrl && !isBrowserOnLocalhost) {
  console.error('Invalid production VITE_API_BASE_URL: localhost cannot be used from Vercel. Falling back to /api.')
}
