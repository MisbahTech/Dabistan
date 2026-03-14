import * as navRepository from '../repositories/nav.repository.js'

export const navService = {
  list(options) {
    return navRepository.listNavLinks(options)
  },

  getById(id) {
    return navRepository.getNavLinkById(id)
  },

  create(payload) {
    return navRepository.createNavLink(payload)
  },

  update(id, payload) {
    return navRepository.updateNavLink(id, payload)
  },

  remove(id) {
    return navRepository.deleteNavLink(id)
  },
}
