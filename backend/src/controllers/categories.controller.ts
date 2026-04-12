import { Request, Response, NextFunction } from 'express'
import { categoriesService } from '../services/categories.service.js'
import { createHttpError, requireFields } from '../utils/http.js'
import { slugify } from '../utils/slugify.js'

async function getCategoryFromParams(req: Request) {
  const identifier = req.params.id as string
  if (!identifier) return null

  const numeric = Number(identifier)
  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    return categoriesService.getById(numeric)
  }

  return categoriesService.getBySlug(identifier)
}

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const q = ((req.query.q as string) ?? '').trim()
    const categories = await categoriesService.list({ q })
    res.json(categories)
  } catch (error) {
    next(error)
  }
}

export async function listPublicCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoriesService.list()
    res.json(categories)
  } catch (error) {
    next(error)
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, slug, description } = (req.body ?? {}) as any
    requireFields({ name }, ['name'])
    const finalSlug = slug ? slugify(slug) : slugify(name)
    const existing = await categoriesService.getBySlug(finalSlug)
    if (existing) {
      throw createHttpError(409, 'Slug already exists')
    }

    const category = await categoriesService.create({
      name,
      slug: finalSlug,
      description: description ?? '',
    })
    res.status(201).json(category)
  } catch (error) {
    next(error)
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, slug, description } = (req.body ?? {}) as any
    requireFields({ name }, ['name'])

    const category = await getCategoryFromParams(req)
    if (!category) {
      throw createHttpError(404, 'Category not found')
    }

    const finalSlug = slug ? slugify(slug) : slugify(name)
    if (finalSlug !== category.slug) {
      const existing = await categoriesService.getBySlug(finalSlug)
      if (existing) {
        throw createHttpError(409, 'Slug already exists')
      }
    }

    const updated = await categoriesService.update(category.id, {
      name,
      slug: finalSlug,
      description: description ?? '',
    })

    res.json(updated)
  } catch (error) {
    next(error)
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await getCategoryFromParams(req)
    if (!category) {
      throw createHttpError(404, 'Category not found')
    }
    await categoriesService.remove(category.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
