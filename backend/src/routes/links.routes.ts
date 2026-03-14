import { Router } from 'express'
import { createLink, deleteLink, getLink, listLinks, updateLink } from '../controllers/links.controller.js'

export const linksRouter = Router()

linksRouter.get('/', listLinks)
linksRouter.get('/:id', getLink)
linksRouter.post('/', createLink)
linksRouter.put('/:id', updateLink)
linksRouter.delete('/:id', deleteLink)
