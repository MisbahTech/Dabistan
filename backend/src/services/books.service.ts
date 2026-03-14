import * as booksRepository from '../repositories/books.repository.js'
import { IBook } from '../models/Book.js'

export const booksService = {
  list(options: booksRepository.ListBooksOptions = {}): Promise<IBook[] | booksRepository.ListBooksResult> {
    return booksRepository.listBooks(options)
  },

  getById(id: number): Promise<IBook | null> {
    return booksRepository.getBookById(id)
  },

  create(payload: booksRepository.CreateBookData): Promise<any> {
    return booksRepository.createBook(payload)
  },

  update(id: number, payload: Partial<booksRepository.CreateBookData>): Promise<IBook | null> {
    return booksRepository.updateBook(id, payload)
  },

  remove(id: number): Promise<IBook | null> {
    return booksRepository.deleteBook(id)
  },
}
