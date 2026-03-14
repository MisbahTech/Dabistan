export interface PaginationOptions {
  page: number
  pageSize: number
  limit: number
  offset: number
  enabled: boolean
}

export function parsePagination(query: any): PaginationOptions {
  const hasPaging = query.page !== undefined || query.page_size !== undefined || query.q !== undefined
  if (!hasPaging) {
    return { page: 1, pageSize: 20, limit: 20, offset: 0, enabled: false }
  }

  const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(query.page_size ?? '20', 10) || 20))
  const offset = (page - 1) * pageSize

  return {
    page,
    pageSize,
    limit: pageSize,
    offset,
    enabled: true,
  }
}

export function formatPaginatedResponse({
  data,
  total,
  page,
  pageSize,
}: {
  data: any[]
  total: number
  page: number
  pageSize: number
}) {
  return {
    data,
    page,
    page_size: pageSize,
    total,
  }
}
