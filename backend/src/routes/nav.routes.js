import { Router } from 'express'
import { createNavLink, deleteNavLink, getNavLink, listNavLinks, updateNavLink } from '../controllers/nav.controller.js'

export const navRouter = Router()

navRouter.get('/', listNavLinks)
navRouter.get('/:id', getNavLink)
navRouter.post('/', createNavLink)
navRouter.put('/:id', updateNavLink)
navRouter.delete('/:id', deleteNavLink)
