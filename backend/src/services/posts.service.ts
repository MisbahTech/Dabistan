import * as postsRepository from '../repositories/posts.repository.js'
import { syncMostReadFromPublishedPosts } from '../repositories/mostRead.repository.js'
import { IPost } from '../models/Post.js'

export const postsService = {
  list(options: postsRepository.ListPostsOptions = {}): Promise<IPost[] | postsRepository.ListPostsResult> {
    return postsRepository.listPosts(options)
  },

  getById(id: postsRepository.PostIdentifier): Promise<IPost | null> {
    return postsRepository.getPostById(id)
  },

  getBySlug(slug: string): Promise<IPost | null> {
    return postsRepository.getPostBySlug(slug)
  },

  async getBySlugAndTrackView(slug: string): Promise<IPost | null> {
    const post = await postsRepository.incrementPublishedPostViewCount(slug)
    if (post) {
      await syncMostReadFromPublishedPosts()
    }
    return post
  },

  async create(payload: postsRepository.CreatePostData): Promise<any> {
    const post = await postsRepository.createPost(payload)
    await syncMostReadFromPublishedPosts()
    return post
  },

  async update(id: postsRepository.PostIdentifier, payload: Partial<postsRepository.CreatePostData>): Promise<IPost | null> {
    const post = await postsRepository.updatePost(id, payload)
    await syncMostReadFromPublishedPosts()
    return post
  },

  async remove(id: postsRepository.PostIdentifier): Promise<IPost | null> {
    const post = await postsRepository.deletePost(id)
    await syncMostReadFromPublishedPosts()
    return post
  },
}
