import mongoose from 'mongoose'
import { env } from '../config/env.js'

let isConnected = false

export async function connectDb() {
  if (isConnected) {
    return mongoose.connection
  }

  if (!env.databaseUrl) {
    throw new Error('MONGODB_URI (or DATABASE_URL) must be set')
  }

  mongoose.set('strictQuery', true)

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
    isConnected = false
  })

  await mongoose.connect(env.databaseUrl)
  isConnected = true
  return mongoose.connection
}

export async function disconnectDb() {
  if (!isConnected) {
    return
  }
  await mongoose.disconnect()
  isConnected = false
}
