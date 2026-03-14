import { mediaService } from '../services/media.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { requireEnum } from '../utils/validation.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

const mediaTypes = ['image', 'video']

export async function listMediaItems(req, res, next) {
  try {
    const pagination = parsePagination(req.query)
    const data = await mediaService.list({
      sectionSlug: req.query.section_slug,
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

export async function getMediaItem(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const data = await mediaService.getById(id)
    ensureFound(data, 'Media item')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createMediaItem(req, res, next) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'media_type', 'title'])
    requireEnum(req.body.media_type, mediaTypes, 'media_type')
    const data = await mediaService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateMediaItem(req, res, next) {
  try {
    const id = parseId(req.params.id)
    requireBody(req)
    requireFieldsFor(req.body, ['section_slug', 'media_type', 'title'])
    requireEnum(req.body.media_type, mediaTypes, 'media_type')
    const data = await mediaService.update(id, req.body)
    ensureFound(data, 'Media item')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteMediaItem(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const data = await mediaService.remove(id)
    ensureFound(data, 'Media item')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
