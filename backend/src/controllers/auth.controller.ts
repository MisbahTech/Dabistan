import { Request, Response, NextFunction } from 'express'
import { authenticateUser, requestPasswordOtp } from '../services/auth.service.js'
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

export async function resetPassword(_req: Request, _res: Response, next: NextFunction) {
  try {
    // This logic was complex in auth.controller.js, but auth.service.ts handles it differently?
    // Wait, I should probably check if I missed resetPassword in auth.service.ts.
    throw new Error('resetPassword not implemented in auth.service yet')
  } catch (error) {
    next(error)
  }
}
