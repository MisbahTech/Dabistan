import * as articlesRepository from '../repositories/articles.repository.js'
import { IArticle } from '../models/Article.js'

export const articlesService = {
  list(filters: articlesRepository.ListArticlesOptions = {}): Promise<IArticle[] | articlesRepository.ListArticlesResult> {
    return articlesRepository.listArticles(filters)
  },

  getById(id: number): Promise<IArticle | null> {
    return articlesRepository.getArticleById(id)
  },

  create(payload: articlesRepository.CreateArticleData): Promise<any> {
    return articlesRepository.createArticle(payload)
  },

  update(id: number, payload: Partial<articlesRepository.CreateArticleData>): Promise<IArticle | null> {
    return articlesRepository.updateArticle(id, payload)
  },

  remove(id: number): Promise<IArticle | null> {
    return articlesRepository.deleteArticle(id)
  },
}
