import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

export async function ensureAdminUser() {
  if (!env.adminEmail || !env.adminPassword) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin seed')
    return
  }

  const normalizedEmail = env.adminEmail.trim().toLowerCase()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) {
    return
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 10)
  await User.create({
    name: env.adminName ?? 'Admin',
    email: normalizedEmail,
    passwordHash,
    role: 'admin',
  })

  console.log('Seeded default admin user')
}
