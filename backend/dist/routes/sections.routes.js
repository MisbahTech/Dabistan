import { Router } from 'express';
import { createSection, deleteSection, getSection, listSections, updateSection } from '../controllers/sections.controller.js';
export const sectionsRouter = Router();
sectionsRouter.get('/', listSections);
sectionsRouter.get('/:id', getSection);
sectionsRouter.post('/', createSection);
sectionsRouter.put('/:id', updateSection);
sectionsRouter.delete('/:id', deleteSection);
//# sourceMappingURL=sections.routes.js.map