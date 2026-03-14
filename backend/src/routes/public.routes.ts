import { Router } from 'express'
import { listPublicCategories } from '../controllers/categories.controller.js'
import { getPublicPost, listPublicPosts } from '../controllers/news.controller.js'

export const publicRouter = Router()

publicRouter.get('/posts', listPublicPosts)
publicRouter.get('/posts/:slug', getPublicPost)
publicRouter.get('/categories', listPublicCategories)
