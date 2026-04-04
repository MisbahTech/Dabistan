import { Router } from 'express';
import { uploadFile } from '../controllers/uploads.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';
export const uploadsRouter = Router();
uploadsRouter.use(requireAuth);
uploadsRouter.use(requireRole(['admin', 'editor']));
uploadsRouter.post('/', uploadMiddleware.single('file'), uploadFile);
//# sourceMappingURL=uploads.routes.js.map