import { Router } from 'express'
import { createArticle, deleteArticle, getArticle, listArticles, updateArticle } from '../controllers/articles.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

export const articlesRouter = Router()

articlesRouter.get('/', listArticles)
articlesRouter.get('/:id', getArticle)
articlesRouter.post('/', requireAuth, requireRole(['admin', 'editor']), createArticle)
articlesRouter.put('/:id', requireAuth, requireRole(['admin', 'editor']), updateArticle)
articlesRouter.delete('/:id', requireAuth, requireRole(['admin', 'editor']), deleteArticle)
