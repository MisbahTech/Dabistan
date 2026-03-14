import { Router } from 'express'
import { listPublicCategories } from '../controllers/categories.controller.js'
import { getPublishedPostBySlug, listPublishedPosts } from '../controllers/posts.controller.js'

export const publicRouter = Router()

publicRouter.get('/posts', listPublishedPosts)
publicRouter.get('/posts/:slug', getPublishedPostBySlug)
publicRouter.get('/categories', listPublicCategories)
