import { MongoClient } from 'mongodb'
import { env } from '../config/env.js'

let client = null
let database = null
let connecting = null
let indexesEnsured = false

async function ensureIndexes(db) {
  if (indexesEnsured) {
    return
  }

  indexesEnsured = true

  await Promise.all([
    db.collection('sections').createIndex({ id: 1 }, { unique: true }),
    db.collection('sections').createIndex({ slug: 1 }, { unique: true }),
    db.collection('books').createIndex({ id: 1 }, { unique: true }),
    db.collection('books').createIndex({ slug: 1 }, { unique: true }),
    db.collection('articles').createIndex({ id: 1 }, { unique: true }),
    db.collection('articles').createIndex({ section_slug: 1 }),
    db.collection('categories').createIndex({ id: 1 }, { unique: true }),
    db.collection('categories').createIndex({ slug: 1 }, { unique: true }),
    db.collection('media_items').createIndex({ id: 1 }, { unique: true }),
    db.collection('media_items').createIndex({ section_slug: 1 }),
    db.collection('links').createIndex({ id: 1 }, { unique: true }),
    db.collection('links').createIndex({ section_slug: 1 }),
    db.collection('posts').createIndex({ id: 1 }, { unique: true }),
    db.collection('posts').createIndex({ slug: 1 }, { unique: true }),
    db.collection('posts').createIndex({ category: 1 }),
    db.collection('posts').createIndex({ published_at: -1 }),
    db.collection('users').createIndex({ id: 1 }, { unique: true }),
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('nav_links').createIndex({ id: 1 }, { unique: true }),
    db.collection('nav_links').createIndex({ nav_key: 1 }, { unique: true }),
    db.collection('contacts').createIndex({ id: 1 }, { unique: true }),
    db.collection('videos').createIndex({ id: 1 }, { unique: true }),
    db.collection('videos').createIndex({ category: 1 }),
    db.collection('videos').createIndex({ published_at: -1 }),
    db.collection('most_read').createIndex({ id: 1 }, { unique: true }),
    db.collection('most_read').createIndex({ slug: 1 }),
    db.collection('most_read').createIndex({ sort_order: 1 }),
    db.collection('weather').createIndex({ id: 1 }, { unique: true }),
    db.collection('weather').createIndex({ location: 1 }),
    db.collection('exchange_rates').createIndex({ id: 1 }, { unique: true }),
    db.collection('exchange_rates').createIndex({ currency: 1 }),
    db.collection('password_otps').createIndex({ email: 1 }),
    db.collection('password_otps').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }),
  ])
}

export async function getDb() {
  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL (or MONGODB_URI) must be set')
  }

  if (database) {
    return database
  }

  if (!connecting) {
    client = new MongoClient(env.databaseUrl)
    connecting = client
      .connect()
      .then(async () => {
        database = client.db()
        await ensureIndexes(database)
        return database
      })
      .catch((error) => {
        client = null
        database = null
        connecting = null
        indexesEnsured = false
        throw error
      })
  }

  return connecting
}

export async function getCollection(name) {
  const db = await getDb()
  return db.collection(name)
}

export async function getNextId(sequenceName) {
  const db = await getDb()
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  )

  // MongoDB driver v6 may return the document directly instead of { value }.
  const doc = result?.value ?? result
  if (!doc || typeof doc.seq !== 'number') {
    throw new Error(`Failed to allocate sequence for ${sequenceName}`)
  }
  return doc.seq
}

export async function closeDb() {
  if (client) {
    await client.close()
  }

  client = null
  database = null
  connecting = null
  indexesEnsured = false
}
