import { postsService } from '../services/posts.service.js';
import { ensureFound, requireBody, requireFieldsFor } from '../utils/handlers.js';
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js';
export async function listPosts(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await postsService.list({
            sectionSlug: req.query.section_slug,
            category: req.query.category_slug,
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
export async function getPost(req, res, next) {
    try {
        const id = req.params.id;
        const data = await postsService.getById(id);
        ensureFound(data, 'Post');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function createPost(req, res, next) {
    try {
        requireBody(req);
        requireFieldsFor(req.body, ['section_slug', 'title', 'content']);
        const data = await postsService.create(req.body);
        res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function updatePost(req, res, next) {
    try {
        const id = req.params.id;
        requireBody(req);
        requireFieldsFor(req.body, ['section_slug', 'title', 'content']);
        const data = await postsService.update(id, req.body);
        ensureFound(data, 'Post');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function deletePost(req, res, next) {
    try {
        const id = req.params.id;
        const data = await postsService.remove(id);
        ensureFound(data, 'Post');
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=posts.controller.js.map