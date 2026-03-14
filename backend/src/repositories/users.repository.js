import { User } from '../models/User.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function findUserByEmail(email) {
  return User.findOne({ email }).select('+password_hash').lean()
}

export async function getUserById(id) {
  return User.findOne({ id }).lean()
}

export async function listUsers(options = {}) {
  const filter = {}

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

export async function createUser({ email, password_hash, role }) {
  const id = await getNextId('users')
  const user = await User.create({
    id,
    email,
    password_hash,
    role,
  })
  return user.toJSON()
}

export async function updateUserRole(id, role) {
  return User.findOneAndUpdate(
    { id },
    { $set: { role } },
    { new: true }
  ).lean()
}

export async function updateUserPassword(id, password_hash) {
  return User.findOneAndUpdate(
    { id },
    { $set: { password_hash } },
    { new: true }
  ).lean()
}

export async function deleteUser(id) {
  return User.findOneAndDelete({ id }).lean()
}

export async function updateLastLogin(id) {
  await User.updateOne({ id }, { $set: { last_login_at: new Date() } })
}
