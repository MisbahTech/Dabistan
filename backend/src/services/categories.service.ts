import * as categoriesRepository from '../repositories/categories.repository.js'
import { ICategory } from '../models/Category.js'

export const categoriesService = {
  list(filters: categoriesRepository.ListCategoriesOptions = {}): Promise<ICategory[] | categoriesRepository.ListCategoriesResult> {
    return categoriesRepository.listCategories(filters)
  },

  getById(id: number): Promise<ICategory | null> {
    return categoriesRepository.getCategoryById(id)
  },

  getBySlug(slug: string): Promise<ICategory | null> {
    return categoriesRepository.getCategoryBySlug(slug)
  },

  create(payload: categoriesRepository.CreateCategoryData): Promise<any> {
    return categoriesRepository.createCategory(payload)
  },

  update(id: number, payload: Partial<categoriesRepository.CreateCategoryData>): Promise<ICategory | null> {
    return categoriesRepository.updateCategory(id, payload)
  },

  remove(id: number): Promise<ICategory | null> {
    return categoriesRepository.deleteCategory(id)
  },
}
