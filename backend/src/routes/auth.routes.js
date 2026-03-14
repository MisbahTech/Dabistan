import { Router } from 'express'
import { forgotPassword, login, me, resetPassword } from '../controllers/auth.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'

export const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)
authRouter.get('/me', requireAuth, me)
