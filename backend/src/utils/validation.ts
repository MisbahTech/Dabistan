import { createHttpError } from './http.js'

export function requireEnum(value: any, allowedValues: any[], fieldName: string): void {
  if (!allowedValues.includes(value)) {
    throw createHttpError(400, `Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`)
  }
}
