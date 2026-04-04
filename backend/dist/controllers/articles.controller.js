import { articlesService } from '../services/articles.service.js';
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js';
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js';
export async function listArticles(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await articlesService.list({
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
export async function getArticle(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await articlesService.getById(id);
        ensureFound(data, 'Article');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function createArticle(req, res, next) {
    try {
        requireBody(req);
        requireFieldsFor(req.body, ['section_slug', 'title', 'href']);
        const data = await articlesService.create(req.body);
        res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function updateArticle(req, res, next) {
    try {
        const id = parseId(req.params.id);
        requireBody(req);
        requireFieldsFor(req.body, ['section_slug', 'title', 'href']);
        const data = await articlesService.update(id, req.body);
        ensureFound(data, 'Article');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function deleteArticle(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await articlesService.remove(id);
        ensureFound(data, 'Article');
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=articles.controller.js.map