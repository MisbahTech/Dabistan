import { Request, Response, NextFunction } from 'express'
import { createHttpError } from '../utils/http.js'

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw createHttpError(400, 'No file uploaded')
    }

    res.status(201).json({
      url: `/uploads/${req.file.filename}`,
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    })
  } catch (error) {
    next(error)
  }
}
