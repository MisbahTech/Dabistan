import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listNavLinks(options = {}) {
  const collection = await getCollection('nav_links')
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ nav_key: regex }, { label: regex }]
    }
  }

  let cursor = collection.find(filter).sort({ sort_order: 1, id: 1 })
  cursor = applyPagination(cursor, options.limit, options.offset)

  const data = await cursor.project({ _id: 0 }).toArray()

  if (options.withTotal) {
    const total = await collection.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getNavLinkById(id) {
  const collection = await getCollection('nav_links')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createNavLink({ nav_key, path, label, sort_order }) {
  const collection = await getCollection('nav_links')
  const id = await getNextId('nav_links')
  const now = new Date()
  const doc = {
    id,
    nav_key,
    path,
    label,
    sort_order: Number.isInteger(sort_order) ? sort_order : 0,
    created_at: now,
    updated_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateNavLink(id, { nav_key, path, label, sort_order }) {
  const collection = await getCollection('nav_links')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        nav_key,
        path,
        label,
        sort_order: Number.isInteger(sort_order) ? sort_order : 0,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteNavLink(id) {
  const collection = await getCollection('nav_links')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
