import { getCollection } from '../db/connection.js'

const COLLECTION = 'password_otps'

export async function replaceOtpForEmail({ email, otp_hash, expires_at }) {
  const collection = await getCollection(COLLECTION)
  await collection.deleteMany({ email })
  const now = new Date()
  await collection.insertOne({
    email,
    otp_hash,
    expires_at,
    created_at: now,
    consumed_at: null,
  })
}
