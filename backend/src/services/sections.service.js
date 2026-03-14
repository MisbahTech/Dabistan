import * as sectionsRepository from '../repositories/sections.repository.js'

export const sectionsService = {
  list(options) {
    return sectionsRepository.listSections(options)
  },

  getById(id) {
    return sectionsRepository.getSectionById(id)
  },

  create(payload) {
    return sectionsRepository.createSection(payload)
  },

  update(id, payload) {
    return sectionsRepository.updateSection(id, payload)
  },

  remove(id) {
    return sectionsRepository.deleteSection(id)
  },
}
