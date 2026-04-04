export function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
export function requireFields(payload, fields) {
    const missing = fields.filter((field) => !payload?.[field]);
    if (missing.length) {
        throw createHttpError(400, `Missing required fields: ${missing.join(', ')}`);
    }
}
//# sourceMappingURL=http.js.map