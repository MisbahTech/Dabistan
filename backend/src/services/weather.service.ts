import * as weatherRepository from '../repositories/weather.repository.js'
import { IWeather } from '../models/Weather.js'

export const weatherService = {
  getLatest(): Promise<IWeather | null> {
    return weatherRepository.getWeather()
  },

  getHistory(limit?: number): Promise<IWeather[]> {
    return weatherRepository.listWeatherHistory(limit)
  },

  update(payload: weatherRepository.CreateWeatherData): Promise<any> {
    return weatherRepository.updateWeather(payload)
  },

  cleanup(days?: number): Promise<void> {
    return weatherRepository.deleteOldWeatherData(days)
  },
}
