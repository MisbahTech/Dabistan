import { Router } from 'express'
import {
  getBooks,
  getBookBySlug,
  getContacts,
  getContentBundle,
  getNavLinks,
  getSections,
  getSectionBySlug,
} from '../controllers/content.controller.js'

export const contentRouter = Router()

contentRouter.get('/all', getContentBundle)
contentRouter.get('/sections', getSections)
contentRouter.get('/sections/:slug', getSectionBySlug)
contentRouter.get('/books', getBooks)
contentRouter.get('/books/:slug', getBookBySlug)
contentRouter.get('/nav', getNavLinks)
contentRouter.get('/contacts', getContacts)
