import { Router } from 'express'
import { createUser, deleteUser, listUsers, updateUser } from '../controllers/users.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)
usersRouter.use(requireRole(['admin']))

usersRouter.get('/', listUsers)
usersRouter.post('/', createUser)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)
