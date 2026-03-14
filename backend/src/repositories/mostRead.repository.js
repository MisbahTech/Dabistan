import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listMostRead(options = {}) {
  const collection = await getCollection('most_read')
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { slug: regex }, { category: regex }]
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

export async function getMostReadById(id) {
  const collection = await getCollection('most_read')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createMostRead({ title, slug, category, published_at, sort_order }) {
  const collection = await getCollection('most_read')
  const id = await getNextId('most_read')
  const now = new Date()
  const doc = {
    id,
    title,
    slug,
    category: category ?? null,
    published_at: published_at ?? null,
    sort_order: sort_order ?? null,
    created_at: now,
    updated_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateMostRead(id, { title, slug, category, published_at, sort_order }) {
  const collection = await getCollection('most_read')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        title,
        slug,
        category: category ?? null,
        published_at: published_at ?? null,
        sort_order: sort_order ?? null,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteMostRead(id) {
  const collection = await getCollection('most_read')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
