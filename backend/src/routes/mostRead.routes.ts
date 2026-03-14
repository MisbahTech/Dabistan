import { Router } from 'express'
import { createMostRead, deleteMostRead, listMostRead, updateMostRead } from '../controllers/mostRead.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

export const mostReadRouter = Router()

mostReadRouter.use(requireAuth)
mostReadRouter.use(requireRole(['admin', 'editor']))

mostReadRouter.get('/', listMostRead)
mostReadRouter.post('/', createMostRead)
mostReadRouter.put('/:id', updateMostRead)
mostReadRouter.delete('/:id', deleteMostRead)
