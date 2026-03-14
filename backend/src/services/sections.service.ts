import * as sectionsRepository from '../repositories/sections.repository.js'
import { ISection } from '../models/Section.js'

export const sectionsService = {
  list(filters: sectionsRepository.ListSectionsOptions = {}): Promise<ISection[] | sectionsRepository.ListSectionsResult> {
    return sectionsRepository.listSections(filters)
  },

  getById(id: number): Promise<ISection | null> {
    return sectionsRepository.getSectionById(id)
  },

  getBySlug(slug: string): Promise<ISection | null> {
    return sectionsRepository.getSectionBySlug(slug)
  },

  create(payload: sectionsRepository.CreateSectionData): Promise<any> {
    return sectionsRepository.createSection(payload)
  },

  update(id: number, payload: Partial<sectionsRepository.CreateSectionData>): Promise<ISection | null> {
    return sectionsRepository.updateSection(id, payload)
  },

  remove(id: number): Promise<ISection | null> {
    return sectionsRepository.deleteSection(id)
  },
}
