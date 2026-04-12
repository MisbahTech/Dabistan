import { Router } from 'express'
import { createRole, deleteRole, getRole, listRoles, updateRole } from '../controllers/roles.controller.js'
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js'

export const rolesRouter = Router()

rolesRouter.use(requireAuth)
rolesRouter.use(requirePermission('roles.manage'))

rolesRouter.get('/', listRoles)
rolesRouter.get('/:id', getRole)
rolesRouter.post('/', createRole)
rolesRouter.put('/:id', updateRole)
rolesRouter.delete('/:id', deleteRole)
