import { createHttpError, requireFields } from '../utils/http.js'

export function parseId(param) {
  const value = Number(param)
  if (!Number.isInteger(value)) {
    throw createHttpError(400, 'Invalid id parameter')
  }
  return value
}

export function requireBody(req) {
  if (!req.body || typeof req.body !== 'object') {
    throw createHttpError(400, 'Request body is required')
  }
}

export function ensureFound(record, label) {
  if (!record) {
    throw createHttpError(404, `${label} not found`)
  }
}

export function requireFieldsFor(body, fields) {
  requireFields(body, fields)
}
