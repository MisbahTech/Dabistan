export function parsePagination(query) {
    const hasPaging = query.page !== undefined || query.page_size !== undefined || query.q !== undefined;
    if (!hasPaging) {
        return { page: 1, pageSize: 20, limit: 20, offset: 0, enabled: false };
    }
    const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(query.page_size ?? '20', 10) || 20));
    const offset = (page - 1) * pageSize;
    return {
        page,
        pageSize,
        limit: pageSize,
        offset,
        enabled: true,
    };
}
export function formatPaginatedResponse({ data, total, page, pageSize, }) {
    return {
        data,
        page,
        page_size: pageSize,
        total,
    };
}
//# sourceMappingURL=pagination.js.map