import { ExchangeRate } from '../models/ExchangeRate.js'
import { createHttpError, requireFields } from '../utils/http.js'

export async function listExchangeRates(req, res, next) {
  try {
    const items = await ExchangeRate.find({}).sort({ updatedAt: -1 })
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export async function createExchangeRate(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['base', 'currency', 'rate'])
    const rate = Number(payload.rate)
    if (Number.isNaN(rate)) {
      throw createHttpError(400, 'Invalid rate')
    }
    const item = await ExchangeRate.create({
      base: payload.base,
      currency: payload.currency,
      rate,
    })
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}

export async function updateExchangeRate(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['base', 'currency', 'rate'])
    const item = await ExchangeRate.findById(req.params.id)
    if (!item) {
      throw createHttpError(404, 'Exchange rate not found')
    }
    const rate = Number(payload.rate)
    if (Number.isNaN(rate)) {
      throw createHttpError(400, 'Invalid rate')
    }
    item.base = payload.base
    item.currency = payload.currency
    item.rate = rate
    await item.save()
    res.json(item)
  } catch (error) {
    next(error)
  }
}

export async function deleteExchangeRate(req, res, next) {
  try {
    const item = await ExchangeRate.findById(req.params.id)
    if (!item) {
      throw createHttpError(404, 'Exchange rate not found')
    }
    await item.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
