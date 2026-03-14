import { Router } from 'express'
import { createWeather, deleteWeather, listWeather, updateWeather } from '../controllers/weather.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

export const weatherRouter = Router()

weatherRouter.use(requireAuth)
weatherRouter.use(requireRole(['admin', 'editor']))

weatherRouter.get('/', listWeather)
weatherRouter.post('/', createWeather)
weatherRouter.put('/:id', updateWeather)
weatherRouter.delete('/:id', deleteWeather)
