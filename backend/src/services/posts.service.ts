import * as postsRepository from '../repositories/posts.repository.js'
import { IPost } from '../models/Post.js'

export const postsService = {
  list(options: postsRepository.ListPostsOptions = {}): Promise<IPost[] | postsRepository.ListPostsResult> {
    return postsRepository.listPosts(options)
  },

  getById(id: number): Promise<IPost | null> {
    return postsRepository.getPostById(id)
  },

  getBySlug(slug: string): Promise<IPost | null> {
    return postsRepository.getPostBySlug(slug)
  },

  create(payload: postsRepository.CreatePostData): Promise<any> {
    return postsRepository.createPost(payload)
  },

  update(id: number, payload: Partial<postsRepository.CreatePostData>): Promise<IPost | null> {
    return postsRepository.updatePost(id, payload)
  },

  remove(id: number): Promise<IPost | null> {
    return postsRepository.deletePost(id)
  },
}
