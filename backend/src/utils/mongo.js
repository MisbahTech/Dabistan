const REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g

export function toSearchRegex(value) {
  if (!value) {
    return null
  }

  const escaped = String(value).replace(REGEX_ESCAPE, '\\$&')
  return new RegExp(escaped, 'i')
}

export function applyPagination(cursor, limit, offset) {
  if (!Number.isInteger(limit)) {
    return cursor
  }

  const safeOffset = Number.isInteger(offset) ? offset : 0
  return cursor.skip(safeOffset).limit(limit)
}
