import { Request, Response, NextFunction } from 'express'
import { weatherService } from '../services/weather.service.js'
import { requireBody, requireFieldsFor } from '../utils/handlers.js'

export async function getLatestWeather(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await weatherService.getLatest()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getWeatherHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
    const data = await weatherService.getHistory(limit)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateWeather(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['location', 'temperature', 'condition'])
    const data = await weatherService.update(req.body)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function cleanupWeather(req: Request, res: Response, next: NextFunction) {
  try {
    const days = req.query.days ? parseInt(req.query.days as string, 10) : undefined
    await weatherService.cleanup(days)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
