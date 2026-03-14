import { sectionsService } from '../services/sections.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listSections(req, res, next) {
  try {
    const pagination = parsePagination(req.query)
    const data = await sectionsService.list({
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

export async function getSection(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const data = await sectionsService.getById(id)
    ensureFound(data, 'Section')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createSection(req, res, next) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['slug', 'title', 'description'])
    const data = await sectionsService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateSection(req, res, next) {
  try {
    const id = parseId(req.params.id)
    requireBody(req)
    requireFieldsFor(req.body, ['slug', 'title', 'description'])
    const data = await sectionsService.update(id, req.body)
    ensureFound(data, 'Section')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteSection(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const data = await sectionsService.remove(id)
    ensureFound(data, 'Section')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
