import { Article, IArticle } from '../models/Article.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListArticlesOptions {
  sectionSlug?: string
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListArticlesResult {
  data: IArticle[]
  total?: number
}

export async function listArticles(options: ListArticlesOptions = {}): Promise<IArticle[] | ListArticlesResult> {
  const filter: any = {}

  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { excerpt: regex }]
    }
  }

  let query = Article.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Article.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getArticleById(id: number): Promise<IArticle | null> {
  return Article.findOne({ id }).lean()
}

export interface CreateArticleData {
  section_slug: string
  title: string
  excerpt?: string | null
  href: string
}

export async function createArticle({ section_slug, title, excerpt, href }: CreateArticleData): Promise<any> {
  const id = await getNextId('articles')
  const article = await Article.create({
    id,
    section_slug,
    title,
    excerpt,
    href,
  })
  return article.toJSON()
}

export async function updateArticle(id: number, data: Partial<CreateArticleData>): Promise<IArticle | null> {
  return Article.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteArticle(id: number): Promise<IArticle | null> {
  return Article.findOneAndDelete({ id }).lean()
}
