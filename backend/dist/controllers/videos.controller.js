import { videosService } from '../services/videos.service.js';
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js';
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js';
export async function listVideos(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await videosService.list({
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
export async function getVideo(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await videosService.getById(id);
        ensureFound(data, 'Video');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function createVideo(req, res, next) {
    try {
        requireBody(req);
        requireFieldsFor(req.body, ['title', 'url', 'category']);
        const data = await videosService.create(req.body);
        res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function updateVideo(req, res, next) {
    try {
        const id = parseId(req.params.id);
        requireBody(req);
        requireFieldsFor(req.body, ['title', 'url', 'category']);
        const data = await videosService.update(id, req.body);
        ensureFound(data, 'Video');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function deleteVideo(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await videosService.remove(id);
        ensureFound(data, 'Video');
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=videos.controller.js.map