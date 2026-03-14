import { Role, IRole } from '../models/Role.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListRolesOptions {
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListRolesResult {
  data: IRole[]
  total?: number
}

export async function findRoleBySlug(slug: string): Promise<IRole | null> {
  return Role.findOne({ slug }).lean()
}

export async function getRoleById(id: number): Promise<IRole | null> {
  return Role.findOne({ id }).lean()
}

export async function getRoleByObjectId(objectId: string): Promise<IRole | null> {
  return Role.findById(objectId).lean()
}

export async function listRoles(options: ListRolesOptions = {}): Promise<IRole[] | ListRolesResult> {
  const filter: any = {}
  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.name = regex
    }
  }

  let query = Role.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query as any

  if (options.withTotal) {
    const total = await Role.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function createRole(data: Partial<IRole>): Promise<any> {
  const id = await getNextId('roles')
  const role = await Role.create({
    ...data,
    id,
  })
  return role.toJSON()
}

export async function updateRole(id: number, data: Partial<IRole>): Promise<IRole | null> {
  return Role.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteRole(id: number): Promise<IRole | null> {
  return Role.findOneAndDelete({ id }).lean()
}

export async function ensureDefaultRoles(): Promise<void> {
  const defaults = [
    { name: 'Admin', slug: 'admin', permissions: ['all'] },
    { name: 'Editor', slug: 'editor', permissions: ['posts.manage', 'categories.manage'] },
  ]

  for (const r of defaults) {
    const exists = await Role.findOne({ slug: r.slug })
    if (!exists) {
      await createRole(r)
    }
  }
}
