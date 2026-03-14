import { createHttpError } from './http.js'

export function requireDate(value, label) {
  if (!value) {
    throw createHttpError(400, `${label} is required`)
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw createHttpError(400, `Invalid ${label}`)
  }
  return date
}

export function optionalDate(value, label) {
  if (value === undefined || value === null || value === '') {
    return null
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw createHttpError(400, `Invalid ${label}`)
  }
  return date
}

export function requireNumber(value, label) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) {
    throw createHttpError(400, `Invalid ${label}`)
  }
  return numberValue
}

export function optionalNumber(value, label) {
  if (value === undefined || value === null || value === '') {
    return null
  }
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) {
    throw createHttpError(400, `Invalid ${label}`)
  }
  return numberValue
}
