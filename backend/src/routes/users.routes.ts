import { Router } from 'express'
import { createUser, deleteUser, listUsers, updateUser, updateUserPassword } from '../controllers/users.controller.js'
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)
usersRouter.use(requirePermission('users.manage'))

usersRouter.get('/', listUsers)
usersRouter.post('/', createUser)
usersRouter.put('/:id', updateUser)
usersRouter.put('/:id/password', updateUserPassword)
usersRouter.delete('/:id', deleteUser)
