import { Router } from 'express'
import { createVideo, deleteVideo, listVideos, updateVideo } from '../controllers/videos.controller.js'
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js'

export const videosRouter = Router()

videosRouter.use(requireAuth)
videosRouter.use(requirePermission('videos.manage'))

videosRouter.get('/', listVideos)
videosRouter.post('/', createVideo)
videosRouter.put('/:id', updateVideo)
videosRouter.delete('/:id', deleteVideo)
