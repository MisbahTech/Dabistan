import { Counter } from '../models/Counter.js'

export async function getNextId(sequenceName) {
  const result = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  return result.seq
}
