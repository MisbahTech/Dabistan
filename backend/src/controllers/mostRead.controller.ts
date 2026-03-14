import { Request, Response, NextFunction } from 'express'
import { mostReadService } from '../services/mostRead.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listMostRead(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await mostReadService.list({
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

export async function getMostRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await mostReadService.getById(id)
    ensureFound(data, 'MostRead')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createMostRead(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['title', 'href', 'views'])
    const data = await mostReadService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateMostRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['title', 'href', 'views'])
    const data = await mostReadService.update(id, req.body)
    ensureFound(data, 'MostRead')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteMostRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await mostReadService.remove(id)
    ensureFound(data, 'MostRead')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
