import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listVideos(options = {}) {
  const collection = await getCollection('videos')
  const filter = {}

  if (options.category) {
    filter.category = options.category
  }

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { description: regex }]
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

export async function getVideoById(id) {
  const collection = await getCollection('videos')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createVideo({ title, url, image, category, duration, published_at, description }) {
  const collection = await getCollection('videos')
  const id = await getNextId('videos')
  const now = new Date()
  const doc = {
    id,
    title,
    url,
    image: image ?? null,
    category: category ?? null,
    duration: duration ?? null,
    description: description ?? null,
    published_at,
    created_at: now,
    updated_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateVideo(id, { title, url, image, category, duration, published_at, description }) {
  const collection = await getCollection('videos')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        title,
        url,
        image: image ?? null,
        category: category ?? null,
        duration: duration ?? null,
        description: description ?? null,
        published_at,
        updated_at: new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteVideo(id) {
  const collection = await getCollection('videos')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
