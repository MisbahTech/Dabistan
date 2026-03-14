import { getCollection, getNextId } from '../db/connection.js'
import { applyPagination } from '../utils/mongo.js'

export async function listExchangeRates(options = {}) {
  const collection = await getCollection('exchange_rates')
  let cursor = collection.find({}).sort({ updated_at: -1, id: -1 })
  cursor = applyPagination(cursor, options.limit, options.offset)
  const data = await cursor.project({ _id: 0 }).toArray()

  if (options.withTotal) {
    const total = await collection.countDocuments({})
    return { data, total }
  }

  return data
}

export async function getExchangeRateById(id) {
  const collection = await getCollection('exchange_rates')
  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function createExchangeRate({ base, currency, rate, updated_at }) {
  const collection = await getCollection('exchange_rates')
  const id = await getNextId('exchange_rates')
  const now = new Date()
  const doc = {
    id,
    base,
    currency,
    rate,
    updated_at: updated_at ?? now,
    created_at: now,
  }

  await collection.insertOne(doc)
  return doc
}

export async function updateExchangeRate(id, { base, currency, rate, updated_at }) {
  const collection = await getCollection('exchange_rates')
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        base,
        currency,
        rate,
        updated_at: updated_at ?? new Date(),
      },
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  )

  return result.value ?? null
}

export async function deleteExchangeRate(id) {
  const collection = await getCollection('exchange_rates')
  const result = await collection.findOneAndDelete({ id }, { projection: { _id: 0 } })
  return result.value ?? null
}
