import { app } from '../src/app.js'
import { connectDb } from '../src/db/mongoose.js'
import { ensureAdminUser } from '../src/utils/seedAdmin.js'

let ready: Promise<void> | null = null

function prepare(): Promise<void> {
  ready ??= connectDb().then(() => ensureAdminUser())
  return ready
}

export default async function handler(req: any, res: any) {
  try {
    await prepare()
    return app(req, res)
  } catch (error) {
    console.error('API startup failed:', error)
    res.status(500).json({ message: 'API startup failed' })
  }
}
