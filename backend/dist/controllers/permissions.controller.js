import { permissionsService } from '../services/permissions.service.js';
import { parsePagination, formatPaginatedResponse } from '../utils/pagination.js';
export async function listPermissions(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const { offset, limit, q, page, pageSize } = pagination;
        const result = await permissionsService.list({
            offset,
            limit,
            q: q,
            withTotal: true
        });
        res.json(formatPaginatedResponse({
            data: result.data,
            total: result.total,
            page,
            pageSize
        }));
    }
    catch (error) {
        next(error);
    }
}
export async function getPermission(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const permission = await permissionsService.getById(id);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.json(permission);
    }
    catch (error) {
        next(error);
    }
}
export async function createPermission(req, res, next) {
    try {
        const permission = await permissionsService.create(req.body);
        res.status(201).json(permission);
    }
    catch (error) {
        next(error);
    }
}
export async function updatePermission(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const permission = await permissionsService.update(id, req.body);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.json(permission);
    }
    catch (error) {
        next(error);
    }
}
export async function deletePermission(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const permission = await permissionsService.remove(id);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.json({ message: 'Permission deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=permissions.controller.js.map