import { Request, Response, NextFunction } from 'express'
import { contentService } from '../services/content.service.js'

export async function getSections(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contentService.getSections()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getSectionBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contentService.getSectionBySlug(req.params.slug as string)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getBooks(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contentService.getBooks()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getBookBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contentService.getBookBySlug(req.params.slug as string)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getNavLinks(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contentService.getNavLinks()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getContacts(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contentService.getContacts()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getContentBundle(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contentService.getContentBundle()
    res.json(data)
  } catch (error) {
    next(error)
  }
}
