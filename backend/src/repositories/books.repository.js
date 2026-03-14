import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listBooks(options = {}) {
  const collection = await getCollection('books')
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

export async function getBookById(id) {
  const collection = await getCollection('books')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createBook({ slug, title, description }) {
  const collection = await getCollection('books')
  const id = await getNextId('books')
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

export async function updateBook(id, { slug, title, description }) {
  const collection = await getCollection('books')
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

export async function deleteBook(id) {
  const collection = await getCollection('books')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
