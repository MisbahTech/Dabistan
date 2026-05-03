import { Post, IPost, IPostAttachment } from '../models/Post.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'
import { isValidObjectId } from 'mongoose'

export interface ListPostsOptions {
  category?: string
  sectionSlug?: string
  status?: string
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListPostsResult {
  data: IPost[]
  total?: number
}

export type PostIdentifier = number | string

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeGallery(image?: string, gallery: unknown[] = []): string[] {
  return [...new Set([image, ...gallery].map(normalizeString).filter(Boolean))]
}

function normalizeAttachment(attachment?: Partial<IPostAttachment> | null): IPostAttachment | null {
  const url = normalizeString(attachment?.url)
  if (!url) {
    return null
  }

  return {
    url,
    name: normalizeString(attachment?.name),
    originalName: normalizeString(attachment?.originalName || attachment?.name),
    size: Number.isFinite(attachment?.size) ? Number(attachment?.size) : 0,
    mimetype: normalizeString(attachment?.mimetype),
  }
}

function resolvePublishedAt(
  status: 'draft' | 'published',
  publishedAt?: Date | string | null,
  currentPublishedAt?: Date | string | null
): Date | string | null {
  if (publishedAt !== undefined) {
    return publishedAt || null
  }

  if (status === 'published') {
    return currentPublishedAt || new Date()
  }

  return null
}

function resolvePostFilter(identifier: PostIdentifier): Record<string, unknown> | null {
  if (typeof identifier === 'number' && Number.isFinite(identifier)) {
    return { id: identifier }
  }

  const value = String(identifier ?? '').trim()
  if (!value || value === 'undefined' || value === 'null') {
    return null
  }

  if (/^\d+$/.test(value)) {
    return { id: Number(value) }
  }

  if (isValidObjectId(value)) {
    return { _id: value }
  }

  return null
}

export async function listPosts(options: ListPostsOptions = {}): Promise<IPost[] | ListPostsResult> {
  const filter: any = {}

  if (options.category) {
    filter.category = options.category
  }
  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }
  if (options.status) {
    filter.status = options.status
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

export async function getPostById(id: PostIdentifier): Promise<IPost | null> {
  const filter = resolvePostFilter(id)
  if (!filter) {
    return null
  }
  return Post.findOne(filter).lean()
}

export async function getPostBySlug(slug: string): Promise<IPost | null> {
  return Post.findOne({ slug }).lean()
}

export async function incrementPublishedPostViewCount(slug: string): Promise<IPost | null> {
  return Post.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { view_count: 1 } },
    { new: true }
  ).lean()
}

export interface CreatePostData {
  title: string
  slug: string
  category: string
  section_slug: string
  excerpt?: string
  image?: string
  gallery?: string[]
  attachment?: IPostAttachment | null
  published_at?: Date | null
  author: string
  status?: 'draft' | 'published'
  content: string
}

export async function createPost({
  title,
  slug,
  category,
  section_slug,
  excerpt,
  image,
  gallery,
  attachment,
  published_at,
  author,
  status,
  content,
}: CreatePostData): Promise<any> {
  const id = await getNextId('posts')
  const normalizedGallery = normalizeGallery(image, gallery)
  const primaryImage = normalizeString(image) || normalizedGallery[0] || ''
  const resolvedStatus = status || 'draft'
  const post = await Post.create({
    id,
    title,
    slug,
    category,
    section_slug,
    excerpt: normalizeString(excerpt),
    image: primaryImage,
    gallery: normalizedGallery,
    attachment: normalizeAttachment(attachment),
    published_at: resolvePublishedAt(resolvedStatus, published_at),
    author,
    status: resolvedStatus,
    content,
  })
  return post.toJSON()
}

export async function updatePost(id: PostIdentifier, data: Partial<CreatePostData>): Promise<IPost | null> {
  const filter = resolvePostFilter(id)
  if (!filter) {
    return null
  }

  const existingPost = await Post.findOne(filter).select('status published_at').lean()
  if (!existingPost) {
    return null
  }

  const normalizedGallery = normalizeGallery(data.image, data.gallery)
  const primaryImage = normalizeString(data.image) || normalizedGallery[0] || ''
  const resolvedStatus = data.status || existingPost.status || 'draft'
  const resolvedPublishedAt = resolvePublishedAt(resolvedStatus, data.published_at, existingPost.published_at)

  return Post.findOneAndUpdate(
    filter,
    {
      $set: {
        ...data,
        excerpt: normalizeString(data.excerpt),
        image: primaryImage,
        gallery: normalizedGallery,
        attachment: normalizeAttachment(data.attachment),
        published_at: resolvedPublishedAt,
        status: resolvedStatus,
      },
    },
    { new: true }
  ).lean()
}

export async function deletePost(id: PostIdentifier): Promise<IPost | null> {
  const filter = resolvePostFilter(id)
  if (!filter) {
    return null
  }
  return Post.findOneAndDelete(filter).lean()
}

