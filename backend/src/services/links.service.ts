import * as linksRepository from '../repositories/links.repository.js'
import { ILink } from '../models/Link.js'

export const linksService = {
  list(filters: linksRepository.ListLinksOptions = {}): Promise<ILink[] | linksRepository.ListLinksResult> {
    return linksRepository.listLinks(filters)
  },

  getById(id: number): Promise<ILink | null> {
    return linksRepository.getLinkById(id)
  },

  create(payload: linksRepository.CreateLinkData): Promise<any> {
    return linksRepository.createLink(payload)
  },

  update(id: number, payload: Partial<linksRepository.CreateLinkData>): Promise<ILink | null> {
    return linksRepository.updateLink(id, payload)
  },

  remove(id: number): Promise<ILink | null> {
    return linksRepository.deleteLink(id)
  },
}
