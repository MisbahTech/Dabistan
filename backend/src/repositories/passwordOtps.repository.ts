import { PasswordReset, IPasswordReset } from '../models/PasswordReset.js'

export async function replaceOtpForEmail({ email, otp_hash, expires_at }: { email: string; otp_hash: string; expires_at: Date }): Promise<void> {
  await PasswordReset.deleteMany({ email })
  await PasswordReset.create({
    email,
    otp_hash,
    expires_at,
  })
}


export async function createOtp(email: string, otp_hash: string, expires_at: Date): Promise<IPasswordReset> {
  return PasswordReset.create({
    email,
    otp_hash,
    expires_at,
  })
}

export async function findValidOtp(email: string): Promise<IPasswordReset | null> {
  return PasswordReset.findOne({
    email,
    expires_at: { $gt: new Date() },
    consumed_at: null,
  }).sort({ created_at: -1 })
}

export async function consumeOtp(id: string): Promise<void> {
  await PasswordReset.findByIdAndUpdate(id, {
    $set: { consumed_at: new Date() },
  })
}
