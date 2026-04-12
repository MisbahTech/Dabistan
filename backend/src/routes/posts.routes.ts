import { Router } from 'express'
import { createPost, deletePost, getPost, listPosts, updatePost } from '../controllers/posts.controller.js'
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js'

export const postsRouter = Router()

postsRouter.use(requireAuth)
postsRouter.use(requirePermission('posts.manage'))

postsRouter.get('/', listPosts)
postsRouter.get('/:id', getPost)
postsRouter.post('/', createPost)
postsRouter.put('/:id', updatePost)
postsRouter.delete('/:id', deletePost)
