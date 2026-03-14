import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { User } from '../models/User.js'
import { PasswordReset } from '../models/PasswordReset.js'
import { signToken } from '../middlewares/auth.middleware.js'
import { createHttpError, requireFields } from '../utils/http.js'
import { sendEmail } from '../utils/mailer.js'

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {}
    requireFields({ email, password }, ['email', 'password'])

    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash')
    if (!user) {
      throw createHttpError(401, 'Invalid credentials')
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw createHttpError(401, 'Invalid credentials')
    }

    const token = signToken({ id: user.id, role: user.role })
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function me(req, res) {
  res.json({ user: req.user })
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function hashOtp(code, salt) {
  return crypto.createHash('sha256').update(`${code}${salt}`).digest('hex')
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body ?? {}
    requireFields({ email }, ['email'])

    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.json({ message: 'If this email exists, an OTP has been sent.' })
    }

    await PasswordReset.deleteMany({ email: normalizedEmail })

    const code = generateOtp()
    const salt = crypto.randomBytes(16).toString('hex')
    const codeHash = hashOtp(code, salt)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await PasswordReset.create({
      email: normalizedEmail,
      codeHash,
      codeSalt: salt,
      expiresAt,
    })

    const subject = 'Your Dabistan OTP Code'
    const text = `Your OTP code is ${code}. It expires in 10 minutes.`
    const html = `
      <p>Your OTP code is <strong>${code}</strong>.</p>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `

    await sendEmail({
      to: normalizedEmail,
      subject,
      text,
      html,
    })

    res.json({ message: 'If this email exists, an OTP has been sent.' })
  } catch (error) {
    next(error)
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body ?? {}
    requireFields({ email, otp, newPassword }, ['email', 'otp', 'newPassword'])

    if (newPassword.length < 8) {
      throw createHttpError(400, 'Password must be at least 8 characters')
    }

    const normalizedEmail = email.trim().toLowerCase()
    const reset = await PasswordReset.findOne({
      email: normalizedEmail,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 })

    if (!reset) {
      throw createHttpError(400, 'OTP expired or invalid')
    }

    const codeHash = hashOtp(String(otp).trim(), reset.codeSalt)
    if (codeHash !== reset.codeHash) {
      throw createHttpError(400, 'OTP expired or invalid')
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash')
    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10)
    await user.save()
    reset.usedAt = new Date()
    await reset.save()

    res.json({ message: 'Password has been reset successfully.' })
  } catch (error) {
    next(error)
  }
}
