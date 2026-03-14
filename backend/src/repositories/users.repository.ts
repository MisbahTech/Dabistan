import { User, IUser } from '../models/User.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListUsersOptions {
  q?: string
  role?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListUsersResult {
  data: IUser[]
  total?: number
}

export async function findUserByEmail(email: string): Promise<(IUser & { password_hash: string }) | null> {
  try {
    return await User.findOne({ email }).populate('role').select('+password_hash').lean() as any
  } catch (error: any) {
    if (error.name === 'CastError' && error.path === 'role') {
      // Fallback for legacy string role data
      const rawUser = await User.findOne({ email }).select('+password_hash').lean() as any
      if (rawUser && typeof rawUser.role === 'string') {
        const roleDoc = await findRoleBySlug(rawUser.role)
        if (roleDoc) {
          rawUser.role = roleDoc
        }
      }
      return rawUser
    }
    throw error
  }
}

export async function getUserById(id: number): Promise<IUser | null> {
  try {
    return await User.findOne({ id }).populate('role').lean()
  } catch (error: any) {
    if (error.name === 'CastError' && error.path === 'role') {
      const rawUser = await User.findOne({ id }).lean() as any
      if (rawUser && typeof rawUser.role === 'string') {
        const roleDoc = await findRoleBySlug(rawUser.role)
        if (roleDoc) {
          rawUser.role = roleDoc
        }
      }
      return rawUser
    }
    throw error
  }
}

export async function listUsers(options: ListUsersOptions = {}): Promise<IUser[] | ListUsersResult> {
  const filter: any = {}
  if (options.role) {
    filter.role = options.role
  }
  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.email = regex
    }
  }

  let query = User.find(filter).sort({ id: 1 }).populate('role').lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query as any

  if (options.withTotal) {
    const total = await User.countDocuments(filter)
    return { data, total }
  }

  return data
}

import { findRoleBySlug } from './roles.repository.js'

export async function createUser({ name, email, password_hash, role }: { name: string; email: string; password_hash: string; role: any }): Promise<any> {
  const id = await getNextId('users')
  
  let roleId = role
  if (typeof role === 'string') {
    const roleDoc = await findRoleBySlug(role)
    if (roleDoc) {
      roleId = (roleDoc as any)._id
    } else {
      throw new Error(`Role not found: ${role}`)
    }
  }

  const user = await User.create({
    id,
    name,
    email,
    password_hash,
    role: roleId,
  })
  return user.toJSON()
}

export async function updateUser(id: number, data: Partial<IUser>): Promise<IUser | null> {
  if (data.role && typeof data.role === 'string') {
    const roleDoc = await findRoleBySlug(data.role)
    if (roleDoc) {
      data.role = (roleDoc as any)._id
    } else {
      throw new Error(`Role not found: ${data.role}`)
    }
  }

  return User.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).populate('role').lean()
}


export async function updateUserPassword(id: number, password_hash: string): Promise<IUser | null> {
  return User.findOneAndUpdate(
    { id },
    { $set: { password_hash } },
    { new: true }
  ).lean()
}

export async function deleteUser(id: number): Promise<IUser | null> {
  return User.findOneAndDelete({ id }).lean()
}

export async function updateLastLogin(id: number): Promise<void> {
  await User.updateOne({ id }, { $set: { last_login_at: new Date() } })
}
