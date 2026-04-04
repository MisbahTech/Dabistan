import { Router } from 'express';
import * as permissionsController from '../controllers/permissions.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
const router = Router();
// All permission routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(['admin']));
router.get('/', permissionsController.listPermissions);
router.get('/:id', permissionsController.getPermission);
router.post('/', permissionsController.createPermission);
router.put('/:id', permissionsController.updatePermission);
router.delete('/:id', permissionsController.deletePermission);
export { router as permissionsRouter };
//# sourceMappingURL=permissions.routes.js.map