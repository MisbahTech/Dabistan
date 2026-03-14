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
  return User.findOne({ email }).select('+password_hash').lean() as any
}

export async function getUserById(id: number): Promise<IUser | null> {
  return User.findOne({ id }).lean()
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

  let query = User.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await User.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function createUser({ name, email, password_hash, role }: { name: string; email: string; password_hash: string; role: string }): Promise<any> {
  const id = await getNextId('users')
  const user = await User.create({
    id,
    name,
    email,
    password_hash,
    role,
  })
  return user.toJSON()
}

export async function updateUser(id: number, data: Partial<IUser>): Promise<IUser | null> {
  return User.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
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
