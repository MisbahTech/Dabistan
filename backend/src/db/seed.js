import { connectDb, disconnectDb } from './mongoose.js'
import { ensureAdminUser } from '../utils/seedAdmin.js'
import { Category } from '../models/Category.js'
import { Post } from '../models/Post.js'
import { User } from '../models/User.js'
import { Video } from '../models/Video.js'
import { MostRead } from '../models/MostRead.js'
import { Weather } from '../models/Weather.js'
import { ExchangeRate } from '../models/ExchangeRate.js'

async function seed() {
  await connectDb()
  await ensureAdminUser()

  const admin = await User.findOne({ role: 'admin' })
  if (!admin) {
    console.warn('No admin found; skipping content seed.')
    return
  }

  const categoryCount = await Category.countDocuments()
  if (!categoryCount) {
    await Category.insertMany([
      { name: 'Afghanistan', slug: 'afghanistan', description: 'Local updates and reports.' },
      { name: 'World', slug: 'world', description: 'Global news and events.' },
      { name: 'Economy', slug: 'economy', description: 'Business and financial updates.' },
      { name: 'Culture', slug: 'culture', description: 'Arts, media, and culture.' },
    ])
  }

  const postCount = await Post.countDocuments()
  if (!postCount) {
    await Post.insertMany([
      {
        title: 'Welcome to Dabistan',
        slug: 'welcome-to-dabistan',
        content: 'This is your first post. Edit or delete it from the dashboard.',
        excerpt: 'This is your first post.',
        category: 'afghanistan',
        featuredImage: 'https://placehold.co/1200x630',
        status: 'published',
        author: admin.id,
        publishedAt: new Date(),
      },
      {
        title: 'Editorial Workflow Overview',
        slug: 'editorial-workflow-overview',
        content: 'Use drafts to collaborate and publish once approved.',
        excerpt: 'Best practices for editors and admins.',
        category: 'culture',
        featuredImage: 'https://placehold.co/1200x630',
        status: 'draft',
        author: admin.id,
        publishedAt: null,
      },
    ])
  }

  const videoCount = await Video.countDocuments()
  if (!videoCount) {
    await Video.insertMany([
      {
        title: 'Dabistan Weekly Briefing',
        url: 'https://example.com/videos/weekly-briefing',
        thumbnail: 'https://placehold.co/640x360',
        category: 'world',
        duration: '06:20',
        description: 'Highlights from the week.',
        publishedAt: new Date(),
      },
      {
        title: 'Afghanistan Economy',
        url: 'https://example.com/videos/afg-economy',
        thumbnail: 'https://placehold.co/640x360',
        category: 'economy',
        duration: '04:10',
        description: 'Economic update and insights.',
        publishedAt: new Date(),
      },
    ])
  }

  const mostReadCount = await MostRead.countDocuments()
  if (!mostReadCount) {
    await MostRead.insertMany([
      {
        title: 'Top Story: Regional Updates',
        slug: 'top-story-regional-updates',
        category: 'afghanistan',
        rank: 1,
        publishedAt: new Date(),
      },
      {
        title: 'Global Markets Snapshot',
        slug: 'global-markets-snapshot',
        category: 'economy',
        rank: 2,
        publishedAt: new Date(),
      },
    ])
  }

  const weatherCount = await Weather.countDocuments()
  if (!weatherCount) {
    await Weather.insertMany([
      { location: 'Kabul', temperature: 18, condition: 'Partly cloudy' },
      { location: 'Herat', temperature: 21, condition: 'Clear' },
    ])
  }

  const exchangeCount = await ExchangeRate.countDocuments()
  if (!exchangeCount) {
    await ExchangeRate.insertMany([
      { base: 'AFN', currency: 'USD', rate: 0.014 },
      { base: 'AFN', currency: 'EUR', rate: 0.013 },
    ])
  }
}

seed()
  .then(async () => {
    await disconnectDb()
    console.log('Seed complete')
  })
  .catch(async (error) => {
    console.error(error)
    await disconnectDb()
    process.exitCode = 1
  })
