import { Request, Response, NextFunction } from 'express'
import { usersService } from '../services/users.service.js'
import { ensureFound, parseId, requireBody, requireFieldsFor } from '../utils/handlers.js'
import { formatPaginatedResponse, parsePagination } from '../utils/pagination.js'

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const data = await usersService.list({
      q: req.query.q as string | undefined,
      role: req.query.role as string | undefined,
      limit: pagination.limit,
      offset: pagination.offset,
      withTotal: pagination.enabled,
    })

    if (pagination.enabled && typeof data === 'object' && 'data' in data) {
      res.json(formatPaginatedResponse({
        data: data.data,
        total: data.total || 0,
        page: pagination.page,
        pageSize: pagination.pageSize
      }))
      return
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await usersService.getById(id)
    ensureFound(data, 'User')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    requireFieldsFor(req.body, ['email', 'password', 'role'])
    const data = await usersService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['role'])
    const data = await usersService.updateRole(id, req.body.role)
    ensureFound(data, 'User')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function updateUserPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    requireBody(req)
    requireFieldsFor(req.body, ['password'])
    const data = await usersService.updatePassword(id, req.body.password)
    ensureFound(data, 'User')
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id as string)
    const data = await usersService.remove(id)
    ensureFound(data, 'User')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
