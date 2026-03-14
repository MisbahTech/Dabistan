import * as navRepository from '../repositories/nav.repository.js'
import { INavLink } from '../models/NavLink.js'

export const navService = {
  list(options: navRepository.ListNavLinksOptions = {}): Promise<INavLink[] | navRepository.ListNavLinksResult> {
    return navRepository.listNavLinks(options)
  },

  getById(id: number): Promise<INavLink | null> {
    return navRepository.getNavLinkById(id)
  },

  create(payload: navRepository.CreateNavLinkData): Promise<any> {
    return navRepository.createNavLink(payload)
  },

  update(id: number, payload: Partial<navRepository.CreateNavLinkData>): Promise<INavLink | null> {
    return navRepository.updateNavLink(id, payload)
  },

  remove(id: number): Promise<INavLink | null> {
    return navRepository.deleteNavLink(id)
  },
}
