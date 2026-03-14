import { contentService } from '../services/content.service.js'

export async function getSections(_req, res, next) {
  try {
    const data = await contentService.getSections()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getSectionBySlug(req, res, next) {
  try {
    const data = await contentService.getSectionBySlug(req.params.slug)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getBooks(_req, res, next) {
  try {
    const data = await contentService.getBooks()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getBookBySlug(req, res, next) {
  try {
    const data = await contentService.getBookBySlug(req.params.slug)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getNavLinks(_req, res, next) {
  try {
    const data = await contentService.getNavLinks()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getContacts(_req, res, next) {
  try {
    const data = await contentService.getContacts()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getContentBundle(_req, res, next) {
  try {
    const data = await contentService.getContentBundle()
    res.json(data)
  } catch (error) {
    next(error)
  }
}
