import * as mediaRepository from '../repositories/media.repository.js';
export const mediaService = {
    list(filters = {}) {
        return mediaRepository.listMediaItems(filters);
    },
    getById(id) {
        return mediaRepository.getMediaItemById(id);
    },
    create(payload) {
        return mediaRepository.createMediaItem(payload);
    },
    update(id, payload) {
        return mediaRepository.updateMediaItem(id, payload);
    },
    remove(id) {
        return mediaRepository.deleteMediaItem(id);
    },
};
//# sourceMappingURL=media.service.js.map