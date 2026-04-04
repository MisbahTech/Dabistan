import { usersService } from '../services/users.service.js';
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js';
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js';
export async function listUsers(req, res, next) {
    try {
        const pagination = parsePagination(req.query);
        const data = await usersService.list({
            q: req.query.q,
            role: req.query.role,
            limit: pagination.limit,
            offset: pagination.offset,
            withTotal: true,
        });
        res.json(formatPaginatedResponse({
            data: data.data,
            total: data.total || 0,
            page: pagination.page,
            pageSize: pagination.pageSize
        }));
    }
    catch (error) {
        next(error);
    }
}
export async function getUser(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await usersService.getById(id);
        ensureFound(data, 'User');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function createUser(req, res, next) {
    try {
        requireBody(req);
        requireFieldsFor(req.body, ['name', 'email', 'password', 'role']);
        const data = await usersService.create(req.body);
        res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function updateUser(req, res, next) {
    try {
        const id = parseId(req.params.id);
        requireBody(req);
        const data = await usersService.update(id, req.body);
        ensureFound(data, 'User');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function updateUserPassword(req, res, next) {
    try {
        const id = parseId(req.params.id);
        requireBody(req);
        requireFieldsFor(req.body, ['password']);
        const data = await usersService.updatePassword(id, req.body.password);
        ensureFound(data, 'User');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function deleteUser(req, res, next) {
    try {
        const id = parseId(req.params.id);
        const data = await usersService.remove(id);
        ensureFound(data, 'User');
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=users.controller.js.map