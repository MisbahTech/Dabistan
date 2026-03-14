import { Request, Response, NextFunction } from 'express'
import { contactsService } from '../services/contacts.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await contactsService.list({
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

export async function getContact(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await contactsService.getById(id)
    ensureFound(data, 'Contact')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createContact(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['id', 'label', 'href'])
    const data = await contactsService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateContact(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['label', 'href'])
    const id = parseId(req.params.id as string)
    const data = await contactsService.update(id, req.body)
    ensureFound(data, 'Contact')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteContact(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await contactsService.remove(id)
    ensureFound(data, 'Contact')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
