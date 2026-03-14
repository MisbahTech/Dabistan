import { Router } from 'express'
import { createEditor, deleteEditor, listEditors, updateEditor } from '../controllers/users.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)
usersRouter.use(requireRole(['admin']))

usersRouter.get('/', listEditors)
usersRouter.post('/', createEditor)
usersRouter.put('/:id', updateEditor)
usersRouter.delete('/:id', deleteEditor)
