import * as linksRepository from '../repositories/links.repository.js'

export const linksService = {
  list(filters) {
    return linksRepository.listLinks(filters)
  },

  getById(id) {
    return linksRepository.getLinkById(id)
  },

  create(payload) {
    return linksRepository.createLink(payload)
  },

  update(id, payload) {
    return linksRepository.updateLink(id, payload)
  },

  remove(id) {
    return linksRepository.deleteLink(id)
  },
}
