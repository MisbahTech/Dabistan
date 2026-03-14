import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Category } from '../src/models/Category.js'
import { Post } from '../src/models/Post.js'

dotenv.config({ path: '.env' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not set')

const badRegex = /\?{3,}|�/
const categoryFilter = { $or: [
  { name: badRegex },
  { slug: badRegex },
  { description: badRegex },
] }
const postFilter = { $or: [
  { title: badRegex },
  { slug: badRegex },
  { content: badRegex },
  { excerpt: badRegex },
  { category: badRegex },
  { featuredImage: badRegex },
  { 'attachment.originalName': badRegex },
  { 'attachment.url': badRegex },
] }

await mongoose.connect(uri)

const catMatches = await Category.find(categoryFilter).select('name slug')
const postMatches = await Post.find(postFilter).select('title slug')

const catResult = await Category.deleteMany(categoryFilter)
const postResult = await Post.deleteMany(postFilter)

await mongoose.disconnect()

console.log(JSON.stringify({
  deleted: {
    categories: catResult.deletedCount,
    posts: postResult.deletedCount,
  },
  samples: {
    categories: catMatches.map((c) => ({ name: c.name, slug: c.slug })),
    posts: postMatches.map((p) => ({ title: p.title, slug: p.slug })),
  },
}, null, 2))