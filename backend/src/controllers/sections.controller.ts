import { Request, Response, NextFunction } from 'express'
import { sectionsService } from '../services/sections.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listSections(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await sectionsService.list({
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

export async function getSection(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await sectionsService.getById(id)
    ensureFound(data, 'Section')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createSection(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['slug', 'name'])
    const data = await sectionsService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateSection(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['slug', 'name'])
    const data = await sectionsService.update(id, req.body)
    ensureFound(data, 'Section')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteSection(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await sectionsService.remove(id)
    ensureFound(data, 'Section')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
