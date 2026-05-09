const DEFAULT_DEV_API_BASE_URL = 'http://localhost:4000/api'

function normalizeApiBaseUrl(value) {
  return String(value || '').trim().replace(/\/$/, '')
}

const configuredApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
const isProduction = import.meta.env.PROD

export const API_BASE_URL = configuredApiBaseUrl || (isProduction ? '/api' : DEFAULT_DEV_API_BASE_URL)

if (isProduction && !configuredApiBaseUrl) {
  console.error('Missing VITE_API_BASE_URL. Set it to your deployed HTTPS backend URL, ending with /api.')
}

if (isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api$/i.test(API_BASE_URL)) {
  console.error('Invalid production VITE_API_BASE_URL: localhost cannot be used from Vercel.')
}
