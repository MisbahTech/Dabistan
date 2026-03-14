import { Video } from '../models/Video.js'
import { createHttpError, requireFields } from '../utils/http.js'

export async function listVideos(req, res, next) {
  try {
    const q = (req.query.q ?? '').trim()
    const filter = q ? { title: new RegExp(q, 'i') } : {}
    const videos = await Video.find(filter).sort({ createdAt: -1 })
    res.json(videos)
  } catch (error) {
    next(error)
  }
}

export async function createVideo(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['title', 'url'])
    const publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : null
    if (publishedAt && Number.isNaN(publishedAt.getTime())) {
      throw createHttpError(400, 'Invalid publishedAt')
    }
    const video = await Video.create({
      title: payload.title,
      url: payload.url,
      thumbnail: payload.thumbnail ?? '',
      category: payload.category ?? '',
      duration: payload.duration ?? '',
      description: payload.description ?? '',
      publishedAt,
    })
    res.status(201).json(video)
  } catch (error) {
    next(error)
  }
}

export async function updateVideo(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['title', 'url'])
    const video = await Video.findById(req.params.id)
    if (!video) {
      throw createHttpError(404, 'Video not found')
    }
    video.title = payload.title
    video.url = payload.url
    video.thumbnail = payload.thumbnail ?? ''
    video.category = payload.category ?? ''
    video.duration = payload.duration ?? ''
    video.description = payload.description ?? ''
    const publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : null
    if (publishedAt && Number.isNaN(publishedAt.getTime())) {
      throw createHttpError(400, 'Invalid publishedAt')
    }
    video.publishedAt = publishedAt
    await video.save()
    res.json(video)
  } catch (error) {
    next(error)
  }
}

export async function deleteVideo(req, res, next) {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) {
      throw createHttpError(404, 'Video not found')
    }
    await video.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
