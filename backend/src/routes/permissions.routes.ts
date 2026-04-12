import { Router } from 'express'
import * as permissionsController from '../controllers/permissions.controller.js'
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js'

const router = Router()

// All permission routes require authentication and specific permission
router.use(requireAuth)
router.use(requirePermission('permissions.manage'))

router.get('/', permissionsController.listPermissions)
router.get('/:id', permissionsController.getPermission)
router.post('/', permissionsController.createPermission)
router.put('/:id', permissionsController.updatePermission)
router.delete('/:id', permissionsController.deletePermission)

export { router as permissionsRouter }
