import { PasswordReset } from '../models/PasswordReset.js'

export async function replaceOtpForEmail({ email, otp_hash, expires_at }) {
  await PasswordReset.deleteMany({ email })
  await PasswordReset.create({
    email,
    otp_hash,
    expires_at,
  })
}

