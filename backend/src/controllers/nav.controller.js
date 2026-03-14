import { navService } from '../services/nav.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listNavLinks(req, res, next) {
  try {
    const pagination = parsePagination(req.query)
    const data = await navService.list({
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

export async function getNavLink(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const data = await navService.getById(id)
    ensureFound(data, 'Nav link')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createNavLink(req, res, next) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['nav_key', 'path', 'label'])
    const data = await navService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateNavLink(req, res, next) {
  try {
    const id = parseId(req.params.id)
    requireBody(req)
    requireFieldsFor(req.body, ['nav_key', 'path', 'label'])
    const data = await navService.update(id, req.body)
    ensureFound(data, 'Nav link')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteNavLink(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const data = await navService.remove(id)
    ensureFound(data, 'Nav link')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
