import { Category } from '../models/Category.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex, applyPagination } from '../utils/mongo.js'

export async function listCategories(options = {}) {
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.name = regex
    }
  }

  let query = Category.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Category.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getCategoryById(id) {
  return Category.findOne({ id }).lean()
}

export async function getCategoryBySlug(slug) {
  return Category.findOne({ slug }).lean()
}

export async function createCategory({ name, slug, description }) {
  const id = await getNextId('categories')
  const category = await Category.create({
    id,
    name,
    slug,
    description,
  })
  return category.toJSON()
}

export async function updateCategory(id, { name, slug, description }) {
  return Category.findOneAndUpdate(
    { id },
    { $set: { name, slug, description } },
    { new: true }
  ).lean()
}

export async function deleteCategory(id) {
  return Category.findOneAndDelete({ id }).lean()
}
