import * as weatherRepository from '../repositories/weather.repository.js'

export const weatherService = {
  list(filters) {
    return weatherRepository.listWeather(filters)
  },

  getById(id) {
    return weatherRepository.getWeatherById(id)
  },

  create(payload) {
    return weatherRepository.createWeather(payload)
  },

  update(id, payload) {
    return weatherRepository.updateWeather(id, payload)
  },

  remove(id) {
    return weatherRepository.deleteWeather(id)
  },
}
