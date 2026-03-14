import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listPosts(options = {}) {
  const collection = await getCollection('posts')
  const filter = {}

  if (options.category) {
    filter.category = options.category
  }

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { excerpt: regex }, { author: regex }, { content: regex }]
    }
  }

  let cursor = collection.find(filter).sort({ published_at: -1, id: -1 })
  cursor = applyPagination(cursor, options.limit, options.offset)

  const data = await cursor.project({ _id: 0 }).toArray()

  if (options.withTotal) {
    const total = await collection.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getPostById(id) {
  const collection = await getCollection('posts')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function getPostBySlug(slug) {
  const collection = await getCollection('posts')
  return collection.findOne({ slug }, { projection: { _id: 0 } })
}

export async function createPost({ title, slug, category, excerpt, image, published_at, author, content }) {
  const collection = await getCollection('posts')
  const id = await getNextId('posts')
  const now = new Date()
  const doc = {
    id,
    title,
    slug,
    category,
    excerpt: excerpt ?? null,
    image: image ?? null,
    published_at,
    author,
    content,
    created_at: now,
    updated_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updatePost(id, { title, slug, category, excerpt, image, published_at, author, content }) {
  const collection = await getCollection('posts')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        title,
        slug,
        category,
        excerpt: excerpt ?? null,
        image: image ?? null,
        published_at,
        author,
        content,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deletePost(id) {
  const collection = await getCollection('posts')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
