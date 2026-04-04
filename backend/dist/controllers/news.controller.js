import { categoriesService } from '../services/categories.service.js';
import { postsService } from '../services/posts.service.js';
import { videosService } from '../services/videos.service.js';
import { mostReadService } from '../services/mostRead.service.js';
import { weatherService } from '../services/weather.service.js';
import { exchangeRatesService } from '../services/exchangeRates.service.js';
import { ensureFound } from '../utils/handlers.js';
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js';
export async function listPublicCategories(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await categoriesService.list({
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
export async function listPublicPosts(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await postsService.list({
            category: req.query.category,
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
export async function getPublicPost(req, res, next) {
    try {
        const data = await postsService.getBySlug(req.params.slug);
        ensureFound(data, 'Post');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function listPublicVideos(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await videosService.list({
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
export async function listPublicMostRead(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await mostReadService.list({
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
export async function listPublicWeather(_req, res, next) {
    try {
        const data = await weatherService.getLatest();
        res.json(data ? [data] : []);
    }
    catch (error) {
        next(error);
    }
}
export async function listPublicExchangeRates(_req, res, next) {
    try {
        const data = await exchangeRatesService.list({});
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=news.controller.js.map