import * as booksRepository from '../repositories/books.repository.js'

export const booksService = {
  list(options) {
    return booksRepository.listBooks(options)
  },

  getById(id) {
    return booksRepository.getBookById(id)
  },

  create(payload) {
    return booksRepository.createBook(payload)
  },

  update(id, payload) {
    return booksRepository.updateBook(id, payload)
  },

  remove(id) {
    return booksRepository.deleteBook(id)
  },
}
