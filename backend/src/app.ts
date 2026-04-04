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

app.disable('x-powered-by')
const corsOrigins = env.corsOrigin
  ? env.corsOrigin.split(',').map((origin: string) => origin.trim()).filter(Boolean)
  : []

app.use(
  cors({
    origin: corsOrigins.length > 1 ? corsOrigins : corsOrigins[0] ?? true,
  })
)
app.use(loggerMiddleware)
app.use(express.json({ limit: '2mb' }))
app.use('/api', (_req: Request, res: Response, next: NextFunction) => {
  const existingType = String(res.getHeader('Content-Type') ?? '')
  if (!existingType) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
  }
  next()
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.resolve(__dirname, '../uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.use('/api', apiRouter)
app.use(notFoundHandler)
app.use(errorHandler)
