import { Router } from 'express';
import { createMediaItem, deleteMediaItem, getMediaItem, listMediaItems, updateMediaItem } from '../controllers/media.controller.js';
export const mediaRouter = Router();
mediaRouter.get('/', listMediaItems);
mediaRouter.get('/:id', getMediaItem);
mediaRouter.post('/', createMediaItem);
mediaRouter.put('/:id', updateMediaItem);
mediaRouter.delete('/:id', deleteMediaItem);
//# sourceMappingURL=media.routes.js.map