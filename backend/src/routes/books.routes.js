import { Router } from 'express'
import { createBook, deleteBook, getBook, listBooks, updateBook } from '../controllers/books.controller.js'

export const booksRouter = Router()

booksRouter.get('/', listBooks)
booksRouter.get('/:id', getBook)
booksRouter.post('/', createBook)
booksRouter.put('/:id', updateBook)
booksRouter.delete('/:id', deleteBook)
