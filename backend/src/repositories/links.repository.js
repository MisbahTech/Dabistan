import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listLinks(options = {}) {
  const collection = await getCollection('links')
  const filter = {}

  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.label = regex
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

export async function getLinkById(id) {
  const collection = await getCollection('links')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createLink({ section_slug, label, href }) {
  const collection = await getCollection('links')
  const id = await getNextId('links')
  const doc = {
    id,
    section_slug,
    label,
    href,
    created_at: new Date(),
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateLink(id, { section_slug, label, href }) {
  const collection = await getCollection('links')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        section_slug,
        label,
        href,
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteLink(id) {
  const collection = await getCollection('links')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
