import { createHttpError } from './http.js';
export function requireEnum(value, allowedValues, fieldName) {
    if (!allowedValues.includes(value)) {
        throw createHttpError(400, `Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`);
    }
}
//# sourceMappingURL=validation.js.map