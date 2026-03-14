import crypto from 'node:crypto'
import { createHttpError, requireFields } from '../utils/http.js'
import { comparePassword, hashPassword } from './password.service.js'
import { signToken } from '../middlewares/auth.middleware.js'
import { usersService } from './users.service.js'
import { replaceOtpForEmail } from '../repositories/passwordOtps.repository.js'
import { sendMail } from './mailer.service.js'

const OTP_TTL_MINUTES = 10

export async function authenticateUser({ email, password }: any): Promise<any> {
  requireFields({ email, password }, ['email', 'password'])
  const user = await usersService.getByEmail(email) as any
  if (!user) {
    throw createHttpError(401, 'Invalid credentials')
  }

  const valid = await comparePassword(password, user.password_hash)
  if (!valid) {
    throw createHttpError(401, 'Invalid credentials')
  }

  await usersService.updateLastLogin(user.id)

  const roleSlug = (user.role as any)?.slug || user.role
  const token = signToken({ id: user.id, email: user.email, role: roleSlug })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: roleSlug,
    },
  }
}

export async function requestPasswordOtp({ email }: any): Promise<any> {
  requireFields({ email }, ['email'])
  const user = await usersService.getByEmail(email)
  if (!user) {
    return { message: 'If this email exists, an OTP has been sent.' }
  }

  const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0')
  const otp_hash = await hashPassword(otp)
  const expires_at = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000)

  await replaceOtpForEmail({ email, otp_hash, expires_at })

  const subject = 'Your Dabistan OTP'
  const text = `Your Dabistan OTP is ${otp}. It expires in ${OTP_TTL_MINUTES} minutes.`
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 8px;">Dabistan OTP</h2>
      <p style="margin: 0 0 12px;">Use the following one-time password to continue:</p>
      <p style="font-size: 22px; font-weight: 700; letter-spacing: 2px; margin: 0 0 12px;">
        ${otp}
      </p>
      <p style="margin: 0;">This OTP expires in ${OTP_TTL_MINUTES} minutes.</p>
    </div>
  `

  await sendMail({ to: email, subject, text, html })

  return { message: 'If this email exists, an OTP has been sent.' }
}
