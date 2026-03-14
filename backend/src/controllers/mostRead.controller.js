import { MostRead } from '../models/MostRead.js'
import { createHttpError, requireFields } from '../utils/http.js'
import { slugify } from '../utils/slugify.js'

export async function listMostRead(req, res, next) {
  try {
    const items = await MostRead.find({}).sort({ rank: 1, createdAt: -1 })
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export async function createMostRead(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['title', 'slug'])
    const rank = Number(payload.rank ?? 0)
    if (Number.isNaN(rank)) {
      throw createHttpError(400, 'Invalid rank')
    }
    const item = await MostRead.create({
      title: payload.title,
      slug: slugify(payload.slug),
      category: payload.category ?? '',
      rank,
      publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
    })
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}

export async function updateMostRead(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['title', 'slug'])
    const item = await MostRead.findById(req.params.id)
    if (!item) {
      throw createHttpError(404, 'Most read item not found')
    }
    item.title = payload.title
    item.slug = slugify(payload.slug)
    item.category = payload.category ?? ''
    const rank = Number(payload.rank ?? item.rank)
    if (Number.isNaN(rank)) {
      throw createHttpError(400, 'Invalid rank')
    }
    item.rank = rank
    item.publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : null
    await item.save()
    res.json(item)
  } catch (error) {
    next(error)
  }
}

export async function deleteMostRead(req, res, next) {
  try {
    const item = await MostRead.findById(req.params.id)
    if (!item) {
      throw createHttpError(404, 'Most read item not found')
    }
    await item.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
