export function createHttpError(statusCode: number, message: string): Error & { statusCode: number } {
  const error = new Error(message) as any
  error.statusCode = statusCode
  return error
}

export function requireFields(payload: any, fields: string[]): void {
  const missing = fields.filter((field) => !payload?.[field])

  if (missing.length) {
    throw createHttpError(400, `Missing required fields: ${missing.join(', ')}`)
  }
}
