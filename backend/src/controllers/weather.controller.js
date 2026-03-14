import { Weather } from '../models/Weather.js'
import { createHttpError, requireFields } from '../utils/http.js'

export async function listWeather(req, res, next) {
  try {
    const items = await Weather.find({}).sort({ updatedAt: -1 })
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export async function createWeather(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['location', 'temperature', 'condition'])
    const temperature = Number(payload.temperature)
    if (Number.isNaN(temperature)) {
      throw createHttpError(400, 'Invalid temperature')
    }
    const item = await Weather.create({
      location: payload.location,
      temperature,
      condition: payload.condition,
    })
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}

export async function updateWeather(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['location', 'temperature', 'condition'])
    const item = await Weather.findById(req.params.id)
    if (!item) {
      throw createHttpError(404, 'Weather entry not found')
    }
    const temperature = Number(payload.temperature)
    if (Number.isNaN(temperature)) {
      throw createHttpError(400, 'Invalid temperature')
    }
    item.location = payload.location
    item.temperature = temperature
    item.condition = payload.condition
    await item.save()
    res.json(item)
  } catch (error) {
    next(error)
  }
}

export async function deleteWeather(req, res, next) {
  try {
    const item = await Weather.findById(req.params.id)
    if (!item) {
      throw createHttpError(404, 'Weather entry not found')
    }
    await item.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
