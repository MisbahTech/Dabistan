import * as postsRepository from '../repositories/posts.repository.js';
export const postsService = {
    list(options = {}) {
        return postsRepository.listPosts(options);
    },
    getById(id) {
        return postsRepository.getPostById(id);
    },
    getBySlug(slug) {
        return postsRepository.getPostBySlug(slug);
    },
    create(payload) {
        return postsRepository.createPost(payload);
    },
    update(id, payload) {
        return postsRepository.updatePost(id, payload);
    },
    remove(id) {
        return postsRepository.deletePost(id);
    },
};
//# sourceMappingURL=posts.service.js.map