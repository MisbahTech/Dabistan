import { Permission, IPermission } from '../models/Permission.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListPermissionsOptions {
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListPermissionsResult {
  data: IPermission[]
  total?: number
}

export async function findPermissionBySlug(slug: string): Promise<IPermission | null> {
  return Permission.findOne({ slug }).lean()
}

export async function findPermissionsBySlugs(slugs: string[]): Promise<IPermission[]> {
  return Permission.find({ slug: { $in: slugs } }).lean()
}

export async function getPermissionById(id: number): Promise<IPermission | null> {
  return Permission.findOne({ id }).lean()
}

export async function listPermissions(options: ListPermissionsOptions = {}): Promise<IPermission[] | ListPermissionsResult> {
  const filter: any = {}
  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [
        { name: regex },
        { slug: regex }
      ]
    }
  }

  let query = Permission.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query as any

  if (options.withTotal) {
    const total = await Permission.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function createPermission(data: Partial<IPermission>): Promise<any> {
  const id = await getNextId('permissions')
  const permission = await Permission.create({
    ...data,
    id,
  })
  return permission.toJSON()
}

export async function updatePermission(id: number, data: Partial<IPermission>): Promise<IPermission | null> {
  return Permission.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deletePermission(id: number): Promise<IPermission | null> {
  return Permission.findOneAndDelete({ id }).lean()
}

export async function ensureDefaultPermissions(): Promise<void> {
  const defaults = [
    { name: 'All Access', slug: 'all', description: 'Superuser access' },
    { name: 'Manage Posts', slug: 'posts.manage', description: 'Create, edit and delete posts' },
    { name: 'Manage Categories', slug: 'categories.manage', description: 'Manage post categories' },
    { name: 'Manage Users', slug: 'users.manage', description: 'Manage admin and editor accounts' },
    { name: 'Manage Roles', slug: 'roles.manage', description: 'Manage system roles' },
    { name: 'Manage Permissions', slug: 'permissions.manage', description: 'Manage system permissions' },
  ]

  for (const p of defaults) {
    const exists = await Permission.findOne({ slug: p.slug })
    if (!exists) {
      await createPermission(p)
    }
  }
}
