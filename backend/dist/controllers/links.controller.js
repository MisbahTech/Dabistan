import { linksService } from '../services/links.service.js';
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js';
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js';
export async function listLinks(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await linksService.list({
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
export async function getLink(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await linksService.getById(id);
        ensureFound(data, 'Link');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function createLink(req, res, next) {
    try {
        requireBody(req);
        requireFieldsFor(req.body, ['section_slug', 'label', 'href']);
        const data = await linksService.create(req.body);
        res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function updateLink(req, res, next) {
    try {
        const id = parseId(req.params.id);
        requireBody(req);
        requireFieldsFor(req.body, ['section_slug', 'label', 'href']);
        const data = await linksService.update(id, req.body);
        ensureFound(data, 'Link');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function deleteLink(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await linksService.remove(id);
        ensureFound(data, 'Link');
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=links.controller.js.map