import * as rolesRepository from '../repositories/roles.repository.js'
import { IRole } from '../models/Role.js'

export const rolesService = {
  list(options: rolesRepository.ListRolesOptions = {}): Promise<IRole[] | rolesRepository.ListRolesResult> {
    return rolesRepository.listRoles(options)
  },

  getById(id: number): Promise<IRole | null> {
    return rolesRepository.getRoleById(id)
  },

  getBySlug(slug: string): Promise<IRole | null> {
    return rolesRepository.findRoleBySlug(slug)
  },

  create(data: Partial<IRole>): Promise<any> {
    return rolesRepository.createRole(data)
  },

  update(id: number, data: Partial<IRole>): Promise<IRole | null> {
    return rolesRepository.updateRole(id, data)
  },

  remove(id: number): Promise<IRole | null> {
    return rolesRepository.deleteRole(id)
  },

  ensureDefaults(): Promise<void> {
    return rolesRepository.ensureDefaultRoles()
  }
}
