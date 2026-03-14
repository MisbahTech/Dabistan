import { Request, Response, NextFunction } from 'express'
import { mediaService } from '../services/media.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listMediaItems(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await mediaService.list({
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

export async function getMediaItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await mediaService.getById(id)
    ensureFound(data, 'MediaItem')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createMediaItem(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'media_type', 'title'])
    const data = await mediaService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateMediaItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'media_type', 'title'])
    const data = await mediaService.update(id, req.body)
    ensureFound(data, 'MediaItem')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteMediaItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await mediaService.remove(id)
    ensureFound(data, 'MediaItem')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
