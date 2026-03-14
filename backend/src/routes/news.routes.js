import { Router } from 'express'
import {
  getPublicPost,
  listPublicCategories,
  listPublicExchangeRates,
  listPublicMostRead,
  listPublicPosts,
  listPublicVideos,
  listPublicWeather,
} from '../controllers/news.controller.js'

export const newsRouter = Router()

newsRouter.get('/categories', listPublicCategories)
newsRouter.get('/posts', listPublicPosts)
newsRouter.get('/posts/:slug', getPublicPost)
newsRouter.get('/videos', listPublicVideos)
newsRouter.get('/most-read', listPublicMostRead)
newsRouter.get('/weather', listPublicWeather)
newsRouter.get('/exchange-rates', listPublicExchangeRates)
