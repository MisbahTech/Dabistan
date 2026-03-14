import { Router } from 'express'
import { createArticle, deleteArticle, getArticle, listArticles, updateArticle } from '../controllers/articles.controller.js'

export const articlesRouter = Router()

articlesRouter.get('/', listArticles)
articlesRouter.get('/:id', getArticle)
articlesRouter.post('/', createArticle)
articlesRouter.put('/:id', updateArticle)
articlesRouter.delete('/:id', deleteArticle)
