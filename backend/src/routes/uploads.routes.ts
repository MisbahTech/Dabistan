import { Router } from 'express'
import { uploadFile } from '../controllers/uploads.controller.js'
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js'
import { uploadMiddleware } from '../middlewares/upload.middleware.js'

export const uploadsRouter = Router()

uploadsRouter.use(requireAuth)
uploadsRouter.use(requirePermission('media.manage'))

uploadsRouter.post('/', uploadMiddleware.single('file'), uploadFile)
