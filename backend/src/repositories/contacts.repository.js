import { getCollection } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listContacts(options = {}) {
  const collection = await getCollection('contacts')
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ id: regex }, { label: regex }]
    }
  }

  let cursor = collection.find(filter).sort({ sort_order: 1, created_at: 1 })
  cursor = applyPagination(cursor, options.limit, options.offset)

  const data = await cursor.project({ _id: 0 }).toArray()

  if (options.withTotal) {
    const total = await collection.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getContactById(id) {
  const collection = await getCollection('contacts')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createContact({ id, label, href, sort_order }) {
  const collection = await getCollection('contacts')
  const now = new Date()
  const doc = {
    id,
    label,
    href,
    sort_order: Number.isInteger(sort_order) ? sort_order : 0,
    created_at: now,
    updated_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateContact(id, { label, href, sort_order }) {
  const collection = await getCollection('contacts')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        label,
        href,
        sort_order: Number.isInteger(sort_order) ? sort_order : 0,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteContact(id) {
  const collection = await getCollection('contacts')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
