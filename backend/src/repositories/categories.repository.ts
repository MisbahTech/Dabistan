import { Category, ICategory } from '../models/Category.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListCategoriesOptions {
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListCategoriesResult {
  data: ICategory[]
  total?: number
}

export async function listCategories(options: ListCategoriesOptions = {}): Promise<ICategory[] | ListCategoriesResult> {
  const filter: any = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ name: regex }, { description: regex }, { slug: regex }]
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

export async function getCategoryById(id: number): Promise<ICategory | null> {
  return Category.findOne({ id }).lean()
}

export async function getCategoryBySlug(slug: string): Promise<ICategory | null> {
  return Category.findOne({ slug }).lean()
}

export interface CreateCategoryData {
  name: string
  slug: string
  description: string
}

export async function createCategory({ name, slug, description }: CreateCategoryData): Promise<any> {
  const id = await getNextId('categories')
  const category = await Category.create({
    id,
    name,
    slug,
    description,
  })
  return category.toJSON()
}

export async function updateCategory(id: number, data: Partial<CreateCategoryData>): Promise<ICategory | null> {
  return Category.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteCategory(id: number): Promise<ICategory | null> {
  return Category.findOneAndDelete({ id }).lean()
}
