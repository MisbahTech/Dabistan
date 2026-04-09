import { Request, Response, NextFunction } from 'express'
import { authenticateUser, requestPasswordOtp, resetPasswordWithOtp } from '../services/auth.service.js'
import { requireBody } from '../utils/handlers.js'

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    const result = await authenticateUser(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function me(req: Request, res: Response) {
  res.json({ user: (req as any).user })
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    const result = await requestPasswordOtp(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    const result = await resetPasswordWithOtp(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
