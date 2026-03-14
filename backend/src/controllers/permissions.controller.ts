import { Request, Response, NextFunction } from 'express'
import { permissionsService } from '../services/permissions.service.js'
import { parsePagination, formatPaginatedResponse } from '../utils/pagination.js'

export async function listPermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query as any) as any
    const { offset, limit, q, page, pageSize } = pagination
    const result = await permissionsService.list({ 
      offset, 
      limit, 
      q: q as string, 
      withTotal: true 
    }) as any
    
    res.json(formatPaginatedResponse({
      data: result.data,
      total: result.total,
      page,
      pageSize
    }))
  } catch (error) {
    next(error)
  }
}

export async function getPermission(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string)
    const permission = await permissionsService.getById(id)
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' })
    }
    res.json(permission)
  } catch (error) {
    next(error)
  }
}

export async function createPermission(req: Request, res: Response, next: NextFunction) {
  try {
    const permission = await permissionsService.create(req.body)
    res.status(201).json(permission)
  } catch (error) {
    next(error)
  }
}

export async function updatePermission(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string)
    const permission = await permissionsService.update(id, req.body)
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' })
    }
    res.json(permission)
  } catch (error) {
    next(error)
  }
}

export async function deletePermission(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string)
    const permission = await permissionsService.remove(id)
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' })
    }
    res.json({ message: 'Permission deleted successfully' })
  } catch (error) {
    next(error)
  }
}
