import { app } from './app.js'
import { env } from './config/env.js'
import { connectDb } from './db/mongoose.js'
import { ensureAdminUser } from './utils/seedAdmin.js'

async function start() {
  try {
    await connectDb()
    await ensureAdminUser()
    app.listen(env.port, () => {
      console.log(`Dabistan backend listening on http://localhost:${env.port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exitCode = 1
  }
}

start()
