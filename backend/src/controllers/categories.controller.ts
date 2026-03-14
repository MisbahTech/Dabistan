import { Request, Response, NextFunction } from 'express'
import { Category } from '../models/Category.js'
import { createHttpError, requireFields } from '../utils/http.js'
import { slugify } from '../utils/slugify.js'

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const q = ((req.query.q as string) ?? '').trim()
    const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { slug: new RegExp(q, 'i') }] } : {}
    const categories = await Category.find(filter).sort({ name: 1 })
    res.json(categories)
  } catch (error) {
    next(error)
  }
}

export async function listPublicCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await Category.find({}).sort({ name: 1 })
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
    const existing = await Category.findOne({ slug: finalSlug })
    if (existing) {
      throw createHttpError(409, 'Slug already exists')
    }

    const category = await Category.create({
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

    const category = await Category.findById(req.params.id)
    if (!category) {
      throw createHttpError(404, 'Category not found')
    }

    const finalSlug = slug ? slugify(slug) : slugify(name)
    if (finalSlug !== category.slug) {
      const existing = await Category.findOne({ slug: finalSlug })
      if (existing) {
        throw createHttpError(409, 'Slug already exists')
      }
    }

    category.name = name
    category.slug = finalSlug
    category.description = description ?? ''
    await category.save()

    res.json(category)
  } catch (error) {
    next(error)
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      throw createHttpError(404, 'Category not found')
    }
    await category.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
