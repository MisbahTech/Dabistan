import { Request, Response, NextFunction } from 'express'
import { linksService } from '../services/links.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listLinks(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await linksService.list({
      sectionSlug: (req.query.section_slug as string) || undefined,
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

export async function getLink(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await linksService.getById(id)
    ensureFound(data, 'Link')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createLink(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'label', 'href'])
    const data = await linksService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateLink(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'label', 'href'])
    const data = await linksService.update(id, req.body)
    ensureFound(data, 'Link')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteLink(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await linksService.remove(id)
    ensureFound(data, 'Link')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
