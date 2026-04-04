export function toSearchRegex(q) {
    if (!q)
        return null;
    const sanitized = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(sanitized, 'i');
}
// In the original code, applyPagination was used on MongoDB cursors.
// In Mongoose, we usually use .skip() and .limit() directly on the query object.
// I will keep this for compatibility if needed, but the repositories are being refactored to use Mongoose query methods.
export function applyPagination(query, limit, offset) {
    if (offset) {
        query = query.skip(offset);
    }
    if (limit) {
        query = query.limit(limit);
    }
    return query;
}
//# sourceMappingURL=mongo.js.map