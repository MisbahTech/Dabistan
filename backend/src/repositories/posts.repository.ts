import { Post, IPost } from '../models/Post.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListPostsOptions {
  category?: string
  sectionSlug?: string
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListPostsResult {
  data: IPost[]
  total?: number
}

export async function listPosts(options: ListPostsOptions = {}): Promise<IPost[] | ListPostsResult> {
  const filter: any = {}

  if (options.category) {
    filter.category = options.category
  }
  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { excerpt: regex }, { author: regex }, { content: regex }]
    }
  }

  let query = Post.find(filter).sort({ published_at: -1, id: -1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Post.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getPostById(id: number): Promise<IPost | null> {
  return Post.findOne({ id }).lean()
}

export async function getPostBySlug(slug: string): Promise<IPost | null> {
  return Post.findOne({ slug }).lean()
}

export interface CreatePostData {
  title: string
  slug: string
  category: string
  section_slug: string
  excerpt?: string
  image?: string
  published_at?: Date | null
  author: string
  content: string
}

export async function createPost({ title, slug, category, section_slug, excerpt, image, published_at, author, content }: CreatePostData): Promise<any> {
  const id = await getNextId('posts')
  const post = await Post.create({
    id,
    title,
    slug,
    category,
    section_slug: section_slug,
    excerpt,
    image,
    published_at,
    author,
    content,
  })
  return post.toJSON()
}

export async function updatePost(id: number, data: Partial<CreatePostData>): Promise<IPost | null> {
  return Post.findOneAndUpdate(
    { id },
    {
      $set: {
        ...data,
        excerpt: data.excerpt ?? null,
        image: data.image ?? null,
      },
    },
    { new: true }
  ).lean()
}

export async function deletePost(id: number): Promise<IPost | null> {
  return Post.findOneAndDelete({ id }).lean()
}
