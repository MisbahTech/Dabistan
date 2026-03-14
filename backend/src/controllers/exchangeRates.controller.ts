import { Request, Response, NextFunction } from 'express'
import { exchangeRatesService } from '../services/exchangeRates.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listExchangeRates(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await exchangeRatesService.list({
      q: req.query.q as string | undefined,
      limit: pagination.limit,
      offset: pagination.offset,
      withTotal: pagination.enabled,
    })

    if (pagination.enabled && typeof data === 'object' && 'data' in data) {
      res.json(formatPaginatedResponse({
        data: data.data,
        total: data.total || 0,
        page: pagination.page,
        pageSize: pagination.pageSize
      }))
      return
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getExchangeRate(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await exchangeRatesService.getById(id)
    ensureFound(data, 'ExchangeRate')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createExchangeRate(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['currency', 'rate'])
    const data = await exchangeRatesService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateExchangeRate(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['currency', 'rate'])
    const data = await exchangeRatesService.update(id, req.body)
    ensureFound(data, 'ExchangeRate')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteExchangeRate(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await exchangeRatesService.remove(id)
    ensureFound(data, 'ExchangeRate')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
