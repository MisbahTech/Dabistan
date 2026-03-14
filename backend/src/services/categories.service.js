import * as categoriesRepository from '../repositories/categories.repository.js'

export const categoriesService = {
  list(filters) {
    return categoriesRepository.listCategories(filters)
  },

  getById(id) {
    return categoriesRepository.getCategoryById(id)
  },

  getBySlug(slug) {
    return categoriesRepository.getCategoryBySlug(slug)
  },

  create(payload) {
    return categoriesRepository.createCategory(payload)
  },

  update(id, payload) {
    return categoriesRepository.updateCategory(id, payload)
  },

  remove(id) {
    return categoriesRepository.deleteCategory(id)
  },
}
