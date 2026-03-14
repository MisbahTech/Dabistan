import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listCategories(options = {}) {
  const collection = await getCollection('categories')
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { slug: regex }, { description: regex }]
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

export async function getCategoryById(id) {
  const collection = await getCollection('categories')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function getCategoryBySlug(slug) {
  const collection = await getCollection('categories')
  return collection.findOne({ slug }, { projection: { _id: 0 } })
}

export async function createCategory({ slug, title, description }) {
  const collection = await getCollection('categories')
  const id = await getNextId('categories')
  const now = new Date()
  const doc = {
    id,
    slug,
    title,
    description: description ?? null,
    created_at: now,
    updated_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateCategory(id, { slug, title, description }) {
  const collection = await getCollection('categories')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        slug,
        title,
        description: description ?? null,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteCategory(id) {
  const collection = await getCollection('categories')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
