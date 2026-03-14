import * as exchangeRatesRepository from '../repositories/exchangeRates.repository.js'
import { IExchangeRate } from '../models/ExchangeRate.js'

export const exchangeRatesService = {
  list(filters: exchangeRatesRepository.ListExchangeRatesOptions = {}): Promise<IExchangeRate[] | exchangeRatesRepository.ListExchangeRatesResult> {
    return exchangeRatesRepository.listExchangeRates(filters)
  },

  getById(id: number): Promise<IExchangeRate | null> {
    return exchangeRatesRepository.getExchangeRateById(id)
  },

  create(payload: exchangeRatesRepository.CreateExchangeRateData): Promise<any> {
    return exchangeRatesRepository.createExchangeRate(payload)
  },

  update(id: number, payload: Partial<exchangeRatesRepository.CreateExchangeRateData>): Promise<IExchangeRate | null> {
    return exchangeRatesRepository.updateExchangeRate(id, payload)
  },

  remove(id: number): Promise<IExchangeRate | null> {
    return exchangeRatesRepository.deleteExchangeRate(id)
  },
}
