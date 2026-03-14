import { ExchangeRate, IExchangeRate } from '../models/ExchangeRate.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListExchangeRatesOptions {
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListExchangeRatesResult {
  data: IExchangeRate[]
  total?: number
}

export async function listExchangeRates(options: ListExchangeRatesOptions = {}): Promise<IExchangeRate[] | ListExchangeRatesResult> {
  const filter: any = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ currency: regex }, { base: regex }]
    }
  }

  let query = ExchangeRate.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await ExchangeRate.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getExchangeRateById(id: number): Promise<IExchangeRate | null> {
  return ExchangeRate.findOne({ id }).lean()
}

export interface CreateExchangeRateData {
  currency: string
  rate: number
  base: string
}

export async function createExchangeRate({ currency, rate, base }: CreateExchangeRateData): Promise<any> {
  const id = await getNextId('exchange_rates')
  const exchangeRate = await ExchangeRate.create({
    id,
    currency,
    rate,
    base,
  })
  return (exchangeRate as any).toJSON()
}

export async function updateExchangeRate(id: number, data: Partial<CreateExchangeRateData>): Promise<IExchangeRate | null> {
  return ExchangeRate.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteExchangeRate(id: number): Promise<IExchangeRate | null> {
  return ExchangeRate.findOneAndDelete({ id }).lean()
}
