export function toSearchRegex(q: string | undefined): RegExp | null {
  if (!q) return null
  const sanitized = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(sanitized, 'i')
}

// In the original code, applyPagination was used on MongoDB cursors.
// In Mongoose, we usually use .skip() and .limit() directly on the query object.
// I will keep this for compatibility if needed, but the repositories are being refactored to use Mongoose query methods.
export function applyPagination<T>(query: any, limit?: number, offset?: number): any {
  if (offset) {
    query = query.skip(offset)
  }
  if (limit) {
    query = query.limit(limit)
  }
  return query
}
