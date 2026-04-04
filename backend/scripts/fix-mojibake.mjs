import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const mongoUrl = process.env.MONGODB_URI ?? process.env.DATABASE_URL
const databaseName = process.env.DATABASE_NAME
const shouldWrite = process.argv.includes('--write')

if (!mongoUrl) {
  console.error('Missing MONGODB_URI or DATABASE_URL in environment.')
  process.exit(1)
}

const collections = [
  'posts',
  'categories',
  'sections',
  'books',
  'articles',
  'media_items',
  'links',
  'nav_links',
  'contacts',
  'most_read',
  'videos',
  'weather',
  'exchange_rates',
]

const mojibakePattern = /[\xC2\xC3\xD8\xD9]|\uFFFD/

function maybeFixString(value) {
  if (!mojibakePattern.test(value)) {
    return value
  }

  const fixed = Buffer.from(value, 'latin1').toString('utf8')
  return fixed || value
}

function collectChanges(value, pathPrefix = '', out = {}) {
  if (typeof value === 'string') {
    const fixed = maybeFixString(value)
    if (fixed !== value && pathPrefix) {
      out[pathPrefix] = fixed
    }
    return out
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nextPath = pathPrefix ? `${pathPrefix}.${index}` : String(index)
      collectChanges(item, nextPath, out)
    })
    return out
  }

  if (!value || typeof value !== 'object') {
    return out
  }

  for (const [key, nested] of Object.entries(value)) {
    if (key === '_id') continue
    const nextPath = pathPrefix ? `${pathPrefix}.${key}` : key
    collectChanges(nested, nextPath, out)
  }

  return out
}

async function run() {
  console.log(shouldWrite ? 'Running in WRITE mode.' : 'Running in DRY-RUN mode.')
  await mongoose.connect(mongoUrl, databaseName ? { dbName: databaseName } : {})
  const db = mongoose.connection.db

  for (const collectionName of collections) {
    const collection = db.collection(collectionName)
    const cursor = collection.find({})

    let scanned = 0
    let changed = 0

    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      if (!doc) continue

      scanned += 1
      const updates = collectChanges(doc)

      if (Object.keys(updates).length === 0) {
        continue
      }

      changed += 1
      if (shouldWrite) {
        await collection.updateOne({ _id: doc._id }, { $set: updates })
      }
    }

    const action = shouldWrite ? 'updated' : 'would update'
    console.log(`${collectionName}: scanned ${scanned}, ${action} ${changed}`)
  }

  await mongoose.disconnect()
}

run().catch(async (error) => {
  console.error('Failed to run mojibake fixer:', error)
  try {
    await mongoose.disconnect()
  } catch {
    // ignore disconnect errors
  }
  process.exit(1)
})
