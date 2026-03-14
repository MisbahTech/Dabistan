import { Request, Response, NextFunction } from 'express'
import { postsService } from '../services/posts.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await postsService.list({
      sectionSlug: req.query.section_slug as string | undefined,
      category: req.query.category_slug as string | undefined,
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

export async function getPost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await postsService.getById(id)
    ensureFound(data, 'Post')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'title', 'content'])
    const data = await postsService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'title', 'content'])
    const data = await postsService.update(id, req.body)
    ensureFound(data, 'Post')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await postsService.remove(id)
    ensureFound(data, 'Post')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
