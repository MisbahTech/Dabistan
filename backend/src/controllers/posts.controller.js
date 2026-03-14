import { Post } from '../models/Post.js'
import { createHttpError, requireFields } from '../utils/http.js'
import { slugify } from '../utils/slugify.js'

function buildPublishedFilter({ q, category } = {}) {
  const conditions = [
    { status: 'published' },
    { $or: [{ publishedAt: null }, { publishedAt: { $lte: new Date() } }] },
  ]

  if (category) {
    conditions.push({ category })
  }

  if (q) {
    const regex = new RegExp(q, 'i')
    conditions.push({ $or: [{ title: regex }, { excerpt: regex }, { content: regex }] })
  }

  return { $and: conditions }
}

export async function listPublishedPosts(req, res, next) {
  try {
    const { q, category } = req.query ?? {}
    const filter = buildPublishedFilter({ q, category })

    const posts = await Post.find(filter)
      .select('title slug excerpt category featuredImage publishedAt author')
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })

    res.json(posts)
  } catch (error) {
    next(error)
  }
}

export async function getPublishedPostBySlug(req, res, next) {
  try {
    const { slug } = req.params
    const filter = buildPublishedFilter()
    filter.$and.push({ slug })

    const post = await Post.findOne(filter).populate('author', 'name email')
    if (!post) {
      throw createHttpError(404, 'Post not found')
    }
    res.json(post)
  } catch (error) {
    next(error)
  }
}

export async function listPosts(req, res, next) {
  try {
    const { q, status, category } = req.query ?? {}
    const filter = {}

    if (status) {
      filter.status = status
    }
    if (category) {
      filter.category = category
    }
    if (q) {
      const regex = new RegExp(q, 'i')
      filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }]
    }

    const posts = await Post.find(filter)
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    next(error)
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email role')
    if (!post) {
      throw createHttpError(404, 'Post not found')
    }
    res.json(post)
  } catch (error) {
    next(error)
  }
}

export async function createPost(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['title', 'content'])

    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title)
    if (!slug) {
      throw createHttpError(400, 'Slug is required')
    }
    const existing = await Post.findOne({ slug })
    if (existing) {
      throw createHttpError(409, 'Slug already exists')
    }

    const resolvedPublishedAt = payload.publishedAt
      ? (() => {
          const date = new Date(payload.publishedAt)
          if (Number.isNaN(date.getTime())) {
            throw createHttpError(400, 'Invalid publishedAt')
          }
          return date
        })()
      : payload.status === 'published'
        ? new Date()
        : null

    const post = await Post.create({
      title: payload.title,
      slug,
      content: payload.content,
      excerpt: payload.excerpt ?? '',
      category: payload.category ?? '',
      featuredImage: payload.featuredImage ?? '',
      attachment: payload.attachment ?? null,
      status: payload.status ?? 'draft',
      author: req.user.id,
      publishedAt: resolvedPublishedAt,
    })

    res.status(201).json(await post.populate('author', 'name email role'))
  } catch (error) {
    next(error)
  }
}

export async function updatePost(req, res, next) {
  try {
    const payload = req.body ?? {}
    requireFields(payload, ['title', 'content'])

    const post = await Post.findById(req.params.id)
    if (!post) {
      throw createHttpError(404, 'Post not found')
    }

    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title)
    if (!slug) {
      throw createHttpError(400, 'Slug is required')
    }
    if (slug !== post.slug) {
      const existing = await Post.findOne({ slug })
      if (existing) {
        throw createHttpError(409, 'Slug already exists')
      }
    }

    post.title = payload.title
    post.slug = slug
    post.content = payload.content
    post.excerpt = payload.excerpt ?? ''
    post.category = payload.category ?? ''
    post.featuredImage = payload.featuredImage ?? ''
    post.attachment = payload.attachment ?? null
    post.status = payload.status ?? post.status
    if (payload.publishedAt !== undefined) {
      if (!payload.publishedAt) {
        post.publishedAt = null
      } else {
        const date = new Date(payload.publishedAt)
        if (Number.isNaN(date.getTime())) {
          throw createHttpError(400, 'Invalid publishedAt')
        }
        post.publishedAt = date
      }
    } else if (payload.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date()
    }

    await post.save()
    res.json(await post.populate('author', 'name email role'))
  } catch (error) {
    next(error)
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      throw createHttpError(404, 'Post not found')
    }

    await post.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
