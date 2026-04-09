import { Router } from 'express';
import { createUser, deleteUser, listUsers, updateUser, updateUserPassword } from '../controllers/users.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
export const usersRouter = Router();
usersRouter.use(requireAuth);
usersRouter.use(requireRole(['admin']));
usersRouter.get('/', listUsers);
usersRouter.post('/', createUser);
usersRouter.put('/:id', updateUser);
usersRouter.put('/:id/password', updateUserPassword);
usersRouter.delete('/:id', deleteUser);
//# sourceMappingURL=users.routes.js.map