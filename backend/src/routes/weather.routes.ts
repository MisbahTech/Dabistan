import { Router } from 'express'
import { getLatestWeather, getWeatherHistory, updateWeather, cleanupWeather } from '../controllers/weather.controller.js'
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js'

export const weatherRouter = Router()

weatherRouter.use(requireAuth)
weatherRouter.use(requirePermission('weather.manage'))

weatherRouter.get('/', getLatestWeather)
weatherRouter.get('/history', getWeatherHistory)
weatherRouter.post('/', updateWeather)
weatherRouter.delete('/cleanup', cleanupWeather)
