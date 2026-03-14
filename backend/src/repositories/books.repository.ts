import { Book, IBook } from '../models/Book.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListBooksOptions {
  sectionSlug?: string
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListBooksResult {
  data: IBook[]
  total?: number
}

export async function listBooks(options: ListBooksOptions = {}): Promise<IBook[] | ListBooksResult> {
  const filter: any = {}

  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }
  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { description: regex }, { slug: regex }]
    }
  }

  let query = Book.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Book.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getBookById(id: number): Promise<IBook | null> {
  return Book.findOne({ id }).lean()
}

export async function getBookBySlug(slug: string): Promise<IBook | null> {
  return Book.findOne({ slug }).lean()
}

export interface CreateBookData {
  title: string
  slug: string
  description: string
}

export async function createBook({ title, slug, description }: CreateBookData): Promise<any> {
  const id = await getNextId('books')
  const book = await Book.create({
    id,
    title,
    slug,
    description,
  })
  return book.toJSON()
}

export async function updateBook(id: number, data: Partial<CreateBookData>): Promise<IBook | null> {
  return Book.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteBook(id: number): Promise<IBook | null> {
  return Book.findOneAndDelete({ id }).lean()
}
