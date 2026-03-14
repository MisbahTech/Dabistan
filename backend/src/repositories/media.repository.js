import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listMediaItems(options = {}) {
  const collection = await getCollection('media_items')
  const filter = {}

  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.title = regex
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

export async function getMediaItemById(id) {
  const collection = await getCollection('media_items')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createMediaItem({ section_slug, media_type, title, url, duration, text }) {
  const collection = await getCollection('media_items')
  const id = await getNextId('media_items')
  const doc = {
    id,
    section_slug,
    media_type,
    title,
    url: url ?? null,
    duration: duration ?? null,
    text: text ?? null,
    created_at: new Date(),
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateMediaItem(id, { section_slug, media_type, title, url, duration, text }) {
  const collection = await getCollection('media_items')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        section_slug,
        media_type,
        title,
        url: url ?? null,
        duration: duration ?? null,
        text: text ?? null,
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteMediaItem(id) {
  const collection = await getCollection('media_items')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
