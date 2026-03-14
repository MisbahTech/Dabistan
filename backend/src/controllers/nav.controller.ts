import { Request, Response, NextFunction } from 'express'
import { navService } from '../services/nav.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listNavLinks(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await navService.list({
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

export async function getNavLink(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await navService.getById(id)
    ensureFound(data, 'NavLink')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createNavLink(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['label', 'href'])
    const data = await navService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateNavLink(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['label', 'href'])
    const data = await navService.update(id, req.body)
    ensureFound(data, 'NavLink')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteNavLink(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await navService.remove(id)
    ensureFound(data, 'NavLink')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
