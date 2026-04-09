import { Request, Response, NextFunction } from 'express'
import { mostReadService } from '../services/mostRead.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { createHttpError } from '../utils/http.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

function normalizeMostReadPayload(payload: any) {
  const rank = Number(payload?.rank)
  if (!Number.isFinite(rank) || rank < 1) {
    throw createHttpError(400, 'Rank must be a positive number')
  }

  return {
    title: String(payload?.title || '').trim(),
    slug: String(payload?.slug || '').trim(),
    rank,
    published_at: payload?.published_at || payload?.publishedAt || null,
  }
}

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
    const payload = normalizeMostReadPayload(req.body)
    requireFieldsFor(payload, ['title', 'slug', 'rank'])
    const data = await mostReadService.create(payload)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateMostRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    const payload = normalizeMostReadPayload(req.body)
    requireFieldsFor(payload, ['title', 'slug', 'rank'])
    const data = await mostReadService.update(id, payload)
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
