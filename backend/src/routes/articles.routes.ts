import { Router } from 'express'
import { createArticle, deleteArticle, getArticle, listArticles, updateArticle } from '../controllers/articles.controller.js'
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js'

export const articlesRouter = Router()

articlesRouter.get('/', listArticles)
articlesRouter.get('/:id', getArticle)
articlesRouter.post('/', requireAuth, requirePermission('posts.manage'), createArticle)
articlesRouter.put('/:id', requireAuth, requirePermission('posts.manage'), updateArticle)
articlesRouter.delete('/:id', requireAuth, requirePermission('posts.manage'), deleteArticle)
