import { Request, Response, NextFunction } from 'express'
import { videosService } from '../services/videos.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listVideos(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await videosService.list({
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

export async function getVideo(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await videosService.getById(id)
    ensureFound(data, 'Video')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createVideo(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['title', 'url', 'category'])
    const data = await videosService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateVideo(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['title', 'url', 'category'])
    const data = await videosService.update(id, req.body)
    ensureFound(data, 'Video')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteVideo(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await videosService.remove(id)
    ensureFound(data, 'Video')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
