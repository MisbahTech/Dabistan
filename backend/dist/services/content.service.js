import { contentRepository } from '../repositories/content.repository.js';
function ensureFound(item, label, slug) {
    if (!item) {
        const error = new Error(`${label} not found: ${slug}`);
        error.statusCode = 404;
        throw error;
    }
    return item;
}
export const contentService = {
    getSections() {
        return contentRepository.fetchSections();
    },
    async getSectionBySlug(slug) {
        const item = await contentRepository.fetchSectionBySlug(slug);
        return ensureFound(item, 'Section', slug);
    },
    getBooks() {
        return contentRepository.fetchBooks();
    },
    async getBookBySlug(slug) {
        const item = await contentRepository.fetchBookBySlug(slug);
        return ensureFound(item, 'Book', slug);
    },
    getNavLinks() {
        return contentRepository.fetchNavLinks();
    },
    getContacts() {
        return contentRepository.fetchContacts();
    },
    getContentBundle() {
        return contentRepository.fetchContentBundle();
    },
};
//# sourceMappingURL=content.service.js.map