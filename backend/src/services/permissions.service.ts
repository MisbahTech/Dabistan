import * as permissionsRepository from '../repositories/permissions.repository.js'
import { IPermission } from '../models/Permission.js'

export const permissionsService = {
  list(options: permissionsRepository.ListPermissionsOptions = {}): Promise<IPermission[] | permissionsRepository.ListPermissionsResult> {
    return permissionsRepository.listPermissions(options)
  },

  getById(id: number): Promise<IPermission | null> {
    return permissionsRepository.getPermissionById(id)
  },

  getBySlug(slug: string): Promise<IPermission | null> {
    return permissionsRepository.findPermissionBySlug(slug)
  },

  create(data: Partial<IPermission>): Promise<any> {
    return permissionsRepository.createPermission(data)
  },

  update(id: number, data: Partial<IPermission>): Promise<IPermission | null> {
    return permissionsRepository.updatePermission(id, data)
  },

  remove(id: number): Promise<IPermission | null> {
    return permissionsRepository.deletePermission(id)
  },

  ensureDefaults(): Promise<void> {
    return permissionsRepository.ensureDefaultPermissions()
  }
}
