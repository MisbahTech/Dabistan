import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { getNextId } from './counter.js'

export async function ensureAdminUser() {
  if (!env.adminEmail || !env.adminPassword) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin seed')
    return
  }

  const normalizedEmail = env.adminEmail.trim().toLowerCase()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) {
    console.log('Admin user already exists:', normalizedEmail)
    return
  }

  const id = await getNextId('users')
  const password_hash = await bcrypt.hash(env.adminPassword, 10)
  await User.create({
    id,
    name: env.adminName ?? 'Admin',
    email: normalizedEmail,
    password_hash,
    role: 'admin',
  })

  console.log('Seeded default admin user:', normalizedEmail)
}
