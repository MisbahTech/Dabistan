import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listArticles(options = {}) {
  const collection = await getCollection('articles')
  const filter = {}

  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { excerpt: regex }]
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

export async function getArticleById(id) {
  const collection = await getCollection('articles')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createArticle({ section_slug, title, excerpt, href }) {
  const collection = await getCollection('articles')
  const id = await getNextId('articles')
  const doc = {
    id,
    section_slug,
    title,
    excerpt: excerpt ?? null,
    href,
    created_at: new Date(),
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateArticle(id, { section_slug, title, excerpt, href }) {
  const collection = await getCollection('articles')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        section_slug,
        title,
        excerpt: excerpt ?? null,
        href,
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteArticle(id) {
  const collection = await getCollection('articles')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
