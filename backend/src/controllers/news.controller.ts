import { Request, Response, NextFunction } from 'express'
import { categoriesService } from '../services/categories.service.js'
import { postsService } from '../services/posts.service.js'
import { videosService } from '../services/videos.service.js'
import { mostReadService } from '../services/mostRead.service.js'
import { weatherService } from '../services/weather.service.js'
import { exchangeRatesService } from '../services/exchangeRates.service.js'
import { ensureFound } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listPublicCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await categoriesService.list({
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

export async function listPublicPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await postsService.list({
      category: req.query.category as string | undefined,
      status: 'published',
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

export async function getPublicPost(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await postsService.getBySlugAndTrackView(req.params.slug as string)
    ensureFound(data, 'Post')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function listPublicVideos(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await videosService.list({
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

export async function listPublicMostRead(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await mostReadService.list({
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

export async function listPublicWeather(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await weatherService.getLatest()
    res.json(data ? [data] : [])
  } catch (error) {
    next(error)
  }
}

export async function listPublicExchangeRates(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await exchangeRatesService.list({})
    res.json(data)
  } catch (error) {
    next(error)
  }
}
