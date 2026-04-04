import { Router } from 'express';
import { createVideo, deleteVideo, listVideos, updateVideo } from '../controllers/videos.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
export const videosRouter = Router();
videosRouter.use(requireAuth);
videosRouter.use(requireRole(['admin', 'editor']));
videosRouter.get('/', listVideos);
videosRouter.post('/', createVideo);
videosRouter.put('/:id', updateVideo);
videosRouter.delete('/:id', deleteVideo);
//# sourceMappingURL=videos.routes.js.map