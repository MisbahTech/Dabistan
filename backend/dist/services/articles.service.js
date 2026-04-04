import * as articlesRepository from '../repositories/articles.repository.js';
export const articlesService = {
    list(filters = {}) {
        return articlesRepository.listArticles(filters);
    },
    getById(id) {
        return articlesRepository.getArticleById(id);
    },
    create(payload) {
        return articlesRepository.createArticle(payload);
    },
    update(id, payload) {
        return articlesRepository.updateArticle(id, payload);
    },
    remove(id) {
        return articlesRepository.deleteArticle(id);
    },
};
//# sourceMappingURL=articles.service.js.map