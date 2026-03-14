import { Request, Response, NextFunction } from 'express'
import { articlesService } from '../services/articles.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listArticles(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await articlesService.list({
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

export async function getArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await articlesService.getById(id)
    ensureFound(data, 'Article')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createArticle(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'title', 'href'])
    const data = await articlesService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'title', 'href'])
    const data = await articlesService.update(id, req.body)
    ensureFound(data, 'Article')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await articlesService.remove(id)
    ensureFound(data, 'Article')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
