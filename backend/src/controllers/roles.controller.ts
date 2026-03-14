import { Request, Response, NextFunction } from 'express'
import { rolesService } from '../services/roles.service.js'
import { requireBody } from '../utils/handlers.js'
import { parsePagination, formatPaginatedResponse } from '../utils/pagination.js'

export async function listRoles(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query)
    const result = await rolesService.list({
      offset: pagination.offset,
      limit: pagination.limit,
      q: req.query.q as string,
      withTotal: pagination.enabled
    })
    
    if (pagination.enabled && typeof result === 'object' && 'data' in result) {
      return res.json(formatPaginatedResponse({
        data: result.data,
        total: result.total || 0,
        page: pagination.page,
        pageSize: pagination.pageSize
      }))
    }
    
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getRole(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string)
    const role = await rolesService.getById(id)
    if (!role) {
      return res.status(404).json({ message: 'Role not found' })
    }
    res.json(role)
  } catch (error) {
    next(error)
  }
}

export async function createRole(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    const role = await rolesService.create(req.body)
    res.status(201).json(role)
  } catch (error) {
    next(error)
  }
}

export async function updateRole(req: Request, res: Response, next: NextFunction) {
  try {
    requireBody(req)
    const id = parseInt(req.params.id as string)
    const role = await rolesService.update(id, req.body)
    if (!role) {
      return res.status(404).json({ message: 'Role not found' })
    }
    res.json(role)
  } catch (error) {
    next(error)
  }
}

export async function deleteRole(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string)
    const role = await rolesService.remove(id)
    if (!role) {
      return res.status(404).json({ message: 'Role not found' })
    }
    res.json({ message: 'Role deleted successfully' })
  } catch (error) {
    next(error)
  }
}
