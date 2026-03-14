import { ExchangeRate } from '../models/ExchangeRate.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination } from '../utils/mongo.js'

export async function listExchangeRates(options = {}) {
  let query = ExchangeRate.find({}).sort({ updated_at: -1, id: -1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await ExchangeRate.countDocuments({})
    return { data, total }
  }

  return data
}

export async function getExchangeRateById(id) {
  return ExchangeRate.findOne({ id }).lean()
}

export async function createExchangeRate({ base, currency, rate }) {
  const id = await getNextId('exchange_rates')
  const exchangeRate = await ExchangeRate.create({
    id,
    base,
    currency,
    rate,
  })
  return exchangeRate.toJSON()
}

export async function updateExchangeRate(id, { base, currency, rate }) {
  return ExchangeRate.findOneAndUpdate(
    { id },
    {
      $set: {
        base,
        currency,
        rate,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteExchangeRate(id) {
  return ExchangeRate.findOneAndDelete({ id }).lean()
}

