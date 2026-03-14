import { contactsService } from '../services/contacts.service.js'
import { ensureFound, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listContacts(req, res, next) {
  try {
    const pagination = parsePagination(req.query)
    const data = await contactsService.list({
      q: req.query.q,
      limit: pagination.limit,
      offset: pagination.offset,
      withTotal: pagination.enabled,
    })

    if (pagination.enabled) {
      res.json(formatPaginatedResponse({ data: data.data, total: data.total, page: pagination.page, pageSize: pagination.pageSize }))
      return
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getContact(req, res, next) {
  try {
    const data = await contactsService.getById(req.params.id)
    ensureFound(data, 'Contact')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createContact(req, res, next) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['id', 'label', 'href'])
    const data = await contactsService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateContact(req, res, next) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['label', 'href'])
    const data = await contactsService.update(req.params.id, req.body)
    ensureFound(data, 'Contact')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteContact(req, res, next) {
  try {
    const data = await contactsService.remove(req.params.id)
    ensureFound(data, 'Contact')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
