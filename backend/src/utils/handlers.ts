import { Request } from 'express'
import { createHttpError } from './http.js'

export function parseId(id: string): number {
  const parsed = parseInt(id, 10)
  if (isNaN(parsed)) {
    throw createHttpError(400, `Invalid ID: ${id}`)
  }
  return parsed
}

export function ensureFound<T>(item: T | null | undefined, label: string): T {
  if (!item) {
    throw createHttpError(404, `${label} not found`)
  }
  return item
}

export function requireBody(req: Request): void {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Request body is required')
  }
}

export function requireFieldsFor(payload: any, fields: string[]): void {
  const missing = fields.filter((field) => !payload?.[field])
  if (missing.length) {
    throw createHttpError(400, `Missing required fields: ${missing.join(', ')}`)
  }
}
