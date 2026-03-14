import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function findUserByEmail(email) {
  const collection = await getCollection('users')
  return collection.findOne(
    { email },
    { projection: { _id: 0 } }
  )
}

export async function getUserById(id) {
  const collection = await getCollection('users')
  return collection.findOne(
    { id },
    { projection: { _id: 0, password_hash: 0 } }
  )
}

export async function listUsers(options = {}) {
  const collection = await getCollection('users')
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.email = regex
    }
  }

  let cursor = collection.find(filter).sort({ id: 1 })
  cursor = applyPagination(cursor, options.limit, options.offset)

  const data = await cursor.project({ _id: 0, password_hash: 0 }).toArray()

  if (options.withTotal) {
    const total = await collection.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function createUser({ email, password_hash, role }) {
  const collection = await getCollection('users')
  const id = await getNextId('users')
  const now = new Date()
  const doc = {
    id,
    email,
    password_hash,
    role,
    last_login_at: null,
    created_at: now,
    updated_at: now,
  }

  await collection.insertOne(doc)
  const { password_hash: _ignored, ...safe } = doc
  return safe
}

export async function updateUserRole(id, role) {
  const collection = await getCollection('users')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        role,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0, password_hash: 0 } }
  )

  return result.value ?? null
}

export async function updateUserPassword(id, password_hash) {
  const collection = await getCollection('users')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        password_hash,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0, password_hash: 0 } }
  )

  return result.value ?? null
}

export async function deleteUser(id) {
  const collection = await getCollection('users')
  const result = await collection.findOneAndDelete(
    { id },
    { projection: { _id: 0, password_hash: 0 } }
  )
  return result.value ?? null
}

export async function updateLastLogin(id) {
  const collection = await getCollection('users')
  await collection.updateOne({ id }, { $set: { last_login_at: new Date() } })
}
