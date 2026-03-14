import { env } from '../config/env.js'

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, _req, res, _next) {
  const isProd = env.nodeEnv === 'production'
  let status = err.statusCode ?? 500
  let message = err.message ?? 'Internal server error'

  if (err.code === 11000) {
    status = 409
    message = 'Duplicate record'
  }

  if (err.name === 'MulterError') {
    status = 400
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large (max 10MB)'
    } else {
      message = err.message || 'Invalid file upload'
    }
  }

  res.status(status).json({
    message,
    stack: isProd ? undefined : err.stack,
  })
}
