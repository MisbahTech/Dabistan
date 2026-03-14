import { Upload } from '../models/Upload.js'
import { createHttpError } from '../utils/http.js'

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      throw createHttpError(400, 'File is required')
    }

    const record = await Upload.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id,
    })

    res.status(201).json(record)
  } catch (error) {
    next(error)
  }
}
