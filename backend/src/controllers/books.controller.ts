import { Request, Response, NextFunction } from 'express'
import { booksService } from '../services/books.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listBooks(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await booksService.list({
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

export async function getBook(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await booksService.getById(id)
    ensureFound(data, 'Book')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createBook(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['slug', 'title', 'description'])
    const data = await booksService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateBook(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['slug', 'title', 'description'])
    const data = await booksService.update(id, req.body)
    ensureFound(data, 'Book')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteBook(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await booksService.remove(id)
    ensureFound(data, 'Book')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
