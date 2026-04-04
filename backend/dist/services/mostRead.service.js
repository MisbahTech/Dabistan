import * as mostReadRepository from '../repositories/mostRead.repository.js';
export const mostReadService = {
    list(filters = {}) {
        return mostReadRepository.listMostRead(filters);
    },
    getById(id) {
        return mostReadRepository.getMostReadById(id);
    },
    create(payload) {
        return mostReadRepository.createMostRead(payload);
    },
    update(id, payload) {
        return mostReadRepository.updateMostRead(id, payload);
    },
    remove(id) {
        return mostReadRepository.deleteMostRead(id);
    },
};
//# sourceMappingURL=mostRead.service.js.map