import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination } from '../utils/mongo.js'

export async function listWeather(options = {}) {
  const collection = await getCollection('weather')
  let cursor = collection.find({}).sort({ updated_at: -1, id: -1 })
  cursor = applyPagination(cursor, options.limit, options.offset)
  const data = await cursor.project({ _id: 0 }).toArray()

  if (options.withTotal) {
    const total = await collection.countDocuments({})
    return { data, total }
  }

  return data
}

export async function getWeatherById(id) {
  const collection = await getCollection('weather')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createWeather({ location, temperature, condition, updated_at }) {
  const collection = await getCollection('weather')
  const id = await getNextId('weather')
  const now = new Date()
  const doc = {
    id,
    location,
    temperature,
    condition,
    updated_at: updated_at ?? now,
    created_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateWeather(id, { location, temperature, condition, updated_at }) {
  const collection = await getCollection('weather')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        location,
        temperature,
        condition,
        updated_at: updated_at ?? new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteWeather(id) {
  const collection = await getCollection('weather')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
