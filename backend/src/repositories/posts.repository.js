import { Post } from '../models/Post.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listPosts(options = {}) {
  const filter = {}

  if (options.category) {
    filter.category = options.category
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

export async function getPostById(id) {
  return Post.findOne({ id }).lean()
}

export async function getPostBySlug(slug) {
  return Post.findOne({ slug }).lean()
}

export async function createPost({ title, slug, category, excerpt, image, published_at, author, content }) {
  const id = await getNextId('posts')
  const post = await Post.create({
    id,
    title,
    slug,
    category,
    excerpt,
    image,
    published_at,
    author,
    content,
  })
  return post.toJSON()
}

export async function updatePost(id, { title, slug, category, excerpt, image, published_at, author, content }) {
  return Post.findOneAndUpdate(
    { id },
    {
      $set: {
        title,
        slug,
        category,
        excerpt: excerpt ?? null,
        image: image ?? null,
        published_at,
        author,
        content,
      },
    },
    { new: true }
  ).lean()
}

export async function deletePost(id) {
  return Post.findOneAndDelete({ id }).lean()
}

