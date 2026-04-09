import dotenv from 'dotenv'
dotenv.config()

import { app } from './app.js'
import { env } from './config/env.js'
import { connectDb } from './db/mongoose.js'
import { ensureAdminUser } from './utils/seedAdmin.js'

// This is the backend process entry point.
// Startup order matters:
// 1. load environment variables
// 2. connect to MongoDB
// 3. ensure a bootstrap admin exists
// 4. start accepting HTTP traffic
async function start(): Promise<void> {
  try {
    await connectDb()
    await ensureAdminUser()

    // The Express app is already configured in app.ts.
    // server.ts only handles process startup concerns, not route wiring.
    app.listen(env.port, () => {
      console.log(`Dabistan backend listening on http://localhost:${env.port}`)
    })

  } catch (error) {
    console.error('Failed to start server:', error)
    process.exitCode = 1
  } 
}

start()
