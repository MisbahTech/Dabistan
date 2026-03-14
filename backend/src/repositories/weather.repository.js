import { Weather } from '../models/Weather.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination } from '../utils/mongo.js'

export async function listWeather(options = {}) {
  let query = Weather.find({}).sort({ updated_at: -1, id: -1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Weather.countDocuments({})
    return { data, total }
  }

  return data
}

export async function getWeatherById(id) {
  return Weather.findOne({ id }).lean()
}

export async function createWeather({ location, temperature, condition }) {
  const id = await getNextId('weather')
  const weather = await Weather.create({
    id,
    location,
    temperature,
    condition,
  })
  return weather.toJSON()
}

export async function updateWeather(id, { location, temperature, condition }) {
  return Weather.findOneAndUpdate(
    { id },
    {
      $set: {
        location,
        temperature,
        condition,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteWeather(id) {
  return Weather.findOneAndDelete({ id }).lean()
}

