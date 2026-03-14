import * as exchangeRatesRepository from '../repositories/exchangeRates.repository.js'

export const exchangeRatesService = {
  list(filters) {
    return exchangeRatesRepository.listExchangeRates(filters)
  },

  getById(id) {
    return exchangeRatesRepository.getExchangeRateById(id)
  },

  create(payload) {
    return exchangeRatesRepository.createExchangeRate(payload)
  },

  update(id, payload) {
    return exchangeRatesRepository.updateExchangeRate(id, payload)
  },

  remove(id) {
    return exchangeRatesRepository.deleteExchangeRate(id)
  },
}
