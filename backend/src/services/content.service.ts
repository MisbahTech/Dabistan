import { contentRepository } from '../repositories/content.repository.js'

function ensureFound<T>(item: T | null, label: string, slug: string): T {
  if (!item) {
    const error = new Error(`${label} not found: ${slug}`) as any
    error.statusCode = 404
    throw error
  }

  return item
}

export const contentService = {
  getSections(): Promise<any[]> {
    return contentRepository.fetchSections()
  },

  async getSectionBySlug(slug: string): Promise<any> {
    const item = await contentRepository.fetchSectionBySlug(slug)
    return ensureFound(item, 'Section', slug)
  },

  getBooks(): Promise<any[]> {
    return contentRepository.fetchBooks()
  },

  async getBookBySlug(slug: string): Promise<any> {
    const item = await contentRepository.fetchBookBySlug(slug)
    return ensureFound(item, 'Book', slug)
  },

  getNavLinks(): Promise<any[]> {
    return contentRepository.fetchNavLinks()
  },

  getContacts(): Promise<any[]> {
    return contentRepository.fetchContacts()
  },

  getContentBundle(): Promise<any> {
    return contentRepository.fetchContentBundle()
  },
}
