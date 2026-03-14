import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { createHttpError, requireFields } from '../utils/http.js'

export async function listEditors(req, res, next) {
  try {
    const q = (req.query.q ?? '').trim()
    const filter = { role: 'editor' }
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
      ]
    }
    const users = await User.find(filter).sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export async function createEditor(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {}
    requireFields({ name, email, password }, ['name', 'email', 'password'])

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      throw createHttpError(409, 'Email already in use')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: 'editor',
    })

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export async function updateEditor(req, res, next) {
  try {
    const { id } = req.params
    const { name, email, password } = req.body ?? {}
    requireFields({ name, email }, ['name', 'email'])

    const user = await User.findById(id)
    if (!user || user.role !== 'editor') {
      throw createHttpError(404, 'Editor not found')
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (normalizedEmail !== user.email) {
      const existing = await User.findOne({ email: normalizedEmail })
      if (existing && existing.id !== user.id) {
        throw createHttpError(409, 'Email already in use')
      }
    }

    user.name = name
    user.email = normalizedEmail
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10)
    }

    await user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export async function deleteEditor(req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user || user.role !== 'editor') {
      throw createHttpError(404, 'Editor not found')
    }

    await user.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
