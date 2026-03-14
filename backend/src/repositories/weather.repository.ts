import { Weather, IWeather } from '../models/Weather.js'
import { getNextId } from '../utils/counter.js'

export async function getWeather(): Promise<IWeather | null> {
  return Weather.findOne({}).sort({ updated_at: -1 }).lean()
}

export async function listWeatherHistory(limit: number = 10): Promise<IWeather[]> {
  return Weather.find({}).sort({ updated_at: -1 }).limit(limit).lean()
}

export interface CreateWeatherData {
  location: string
  temperature: number
  condition: string
  icon: string
}

export async function updateWeather({ location, temperature, condition, icon }: CreateWeatherData): Promise<any> {
  const id = await getNextId('weather')
  const weather = await Weather.create({
    id,
    location,
    temperature,
    condition,
    icon,
  })
  return weather.toJSON()
}

export async function deleteOldWeatherData(days: number = 7): Promise<void> {
  const date = new Date()
  date.setDate(date.getDate() - days)
  await Weather.deleteMany({ created_at: { $lt: date } })
}
