import { booksService } from '../services/books.service.js';
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js';
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js';
export async function listBooks(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await booksService.list({
            sectionSlug: req.query.section_slug || undefined,
            q: req.query.q,
            limit: pagination.limit,
            offset: pagination.offset,
            withTotal: pagination.enabled,
        });
        if (pagination.enabled && typeof data === 'object' && 'data' in data) {
            res.json(formatPaginatedResponse({
                data: data.data,
                total: data.total || 0,
                page: pagination.page,
                pageSize: pagination.pageSize
            }));
            return;
        }
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function getBook(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await booksService.getById(id);
        ensureFound(data, 'Book');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function createBook(req, res, next) {
    try {
        requireBody(req);
        requireFieldsFor(req.body, ['slug', 'title', 'description']);
        const data = await booksService.create(req.body);
        res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function updateBook(req, res, next) {
    try {
        const id = parseId(req.params.id);
        requireBody(req);
        requireFieldsFor(req.body, ['slug', 'title', 'description']);
        const data = await booksService.update(id, req.body);
        ensureFound(data, 'Book');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function deleteBook(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await booksService.remove(id);
        ensureFound(data, 'Book');
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=books.controller.js.map