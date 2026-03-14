import { createHttpError, requireFields } from '../utils/http.js'

export function requireEnum(value, options, field) {
  if (!options.includes(value)) {
    throw createHttpError(400, `Invalid ${field}. Expected one of: ${options.join(', ')}`)
  }
}

export function requirePayloadFields(payload, fields) {
  requireFields(payload, fields)
}
