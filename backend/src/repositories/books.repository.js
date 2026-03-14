import { Book } from '../models/Book.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listBooks(options = {}) {
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ slug: regex }, { title: regex }]
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

export async function getBookById(id) {
  return Book.findOne({ id }).lean()
}

export async function createBook({ slug, title, description }) {
  const id = await getNextId('books')
  const book = await Book.create({
    id,
    slug,
    title,
    description,
  })
  return book.toJSON()
}

export async function updateBook(id, { slug, title, description }) {
  return Book.findOneAndUpdate(
    { id },
    {
      $set: {
        slug,
        title,
        description,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteBook(id) {
  return Book.findOneAndDelete({ id }).lean()
}

