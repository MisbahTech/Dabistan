import { Router } from 'express';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../controllers/categories.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
export const categoriesRouter = Router();
categoriesRouter.use(requireAuth);
categoriesRouter.use(requireRole(['admin', 'editor']));
categoriesRouter.get('/', listCategories);
categoriesRouter.post('/', createCategory);
categoriesRouter.put('/:id', updateCategory);
categoriesRouter.delete('/:id', deleteCategory);
//# sourceMappingURL=categories.routes.js.map