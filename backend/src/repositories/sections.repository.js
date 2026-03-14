import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listSections(options = {}) {
  const collection = await getCollection('sections')
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ slug: regex }, { title: regex }]
    }
  }

  let cursor = collection.find(filter).sort({ id: 1 })
  cursor = applyPagination(cursor, options.limit, options.offset)

  const data = await cursor.project({ _id: 0 }).toArray()

  if (options.withTotal) {
    const total = await collection.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getSectionById(id) {
  const collection = await getCollection('sections')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createSection({ slug, title, description }) {
  const collection = await getCollection('sections')
  const id = await getNextId('sections')
  const now = new Date()
  const doc = {
    id,
    slug,
    title,
    description,
    created_at: now,
    updated_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateSection(id, { slug, title, description }) {
  const collection = await getCollection('sections')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        slug,
        title,
        description,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteSection(id) {
  const collection = await getCollection('sections')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
