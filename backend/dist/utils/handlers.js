import { createHttpError } from './http.js';
export function parseId(id) {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) {
        throw createHttpError(400, `Invalid ID: ${id}`);
    }
    return parsed;
}
export function ensureFound(item, label) {
    if (!item) {
        throw createHttpError(404, `${label} not found`);
    }
    return item;
}
export function requireBody(req) {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw createHttpError(400, 'Request body is required');
    }
}
export function requireFieldsFor(payload, fields) {
    const missing = fields.filter((field) => !payload?.[field]);
    if (missing.length) {
        throw createHttpError(400, `Missing required fields: ${missing.join(', ')}`);
    }
}
//# sourceMappingURL=handlers.js.map