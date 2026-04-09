import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'

export const app = express()

// Small hardening choice: avoid exposing framework details in response headers.
app.disable('x-powered-by')
const corsOrigins = env.corsOrigin
  ? env.corsOrigin.split(',').map((origin: string) => origin.trim()).filter(Boolean)
  : []

// CORS controls which browser frontends may call this backend directly.
// One origin stays a string; multiple origins stay an array so the cors package can validate them.
app.use(
  cors({
    origin: corsOrigins.length > 1 ? corsOrigins : corsOrigins[0] ?? true,
  })
)
app.use(loggerMiddleware)
// JSON parsing is global because almost every write endpoint expects JSON bodies.
// The size limit is a guardrail against accidentally large payloads.
app.use(express.json({ limit: '2mb' }))
app.use('/api', (_req: Request, res: Response, next: NextFunction) => {
  // Force UTF-8 JSON for API responses unless a route has already set a more specific content type.
  const existingType = String(res.getHeader('Content-Type') ?? '')
  if (!existingType) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
  }
  next()
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.resolve(__dirname, '../uploads')

// Uploaded files are served back through /uploads, so the directory must exist before requests arrive.
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.use('/uploads', express.static(uploadsDir))

// Lightweight health route for uptime checks and quick local diagnostics.
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Route handlers run before the fallback handlers below.
app.use('/api', apiRouter)
app.use(notFoundHandler)
app.use(errorHandler)
