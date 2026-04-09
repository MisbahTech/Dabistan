import * as postsRepository from '../repositories/posts.repository.js';
import { syncMostReadFromPublishedPosts } from '../repositories/mostRead.repository.js';
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
    async getBySlugAndTrackView(slug) {
        const post = await postsRepository.incrementPublishedPostViewCount(slug);
        if (post) {
            await syncMostReadFromPublishedPosts();
        }
        return post;
    },
    async create(payload) {
        const post = await postsRepository.createPost(payload);
        await syncMostReadFromPublishedPosts();
        return post;
    },
    async update(id, payload) {
        const post = await postsRepository.updatePost(id, payload);
        await syncMostReadFromPublishedPosts();
        return post;
    },
    async remove(id) {
        const post = await postsRepository.deletePost(id);
        await syncMostReadFromPublishedPosts();
        return post;
    },
};
//# sourceMappingURL=posts.service.js.map