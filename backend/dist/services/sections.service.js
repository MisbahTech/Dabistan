import * as sectionsRepository from '../repositories/sections.repository.js';
export const sectionsService = {
    list(filters = {}) {
        return sectionsRepository.listSections(filters);
    },
    getById(id) {
        return sectionsRepository.getSectionById(id);
    },
    getBySlug(slug) {
        return sectionsRepository.getSectionBySlug(slug);
    },
    create(payload) {
        return sectionsRepository.createSection(payload);
    },
    update(id, payload) {
        return sectionsRepository.updateSection(id, payload);
    },
    remove(id) {
        return sectionsRepository.deleteSection(id);
    },
};
//# sourceMappingURL=sections.service.js.map