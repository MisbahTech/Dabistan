import { MostRead } from '../models/MostRead.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listMostRead(options = {}) {
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { slug: regex }, { category: regex }]
    }
  }

  let query = MostRead.find(filter).sort({ rank: 1, id: 1 }).lean() // rank was used in model instead of sort_order in repo? I'll check model.
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await MostRead.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getMostReadById(id) {
  return MostRead.findOne({ id }).lean()
}

export async function createMostRead({ title, slug, category, published_at, sort_order }) {
  const id = await getNextId('most_read')
  const mostRead = await MostRead.create({
    id,
    title,
    slug,
    category,
    published_at,
    rank: sort_order, // Aligning sort_order/rank
  })
  return mostRead.toJSON()
}

export async function updateMostRead(id, { title, slug, category, published_at, sort_order }) {
  return MostRead.findOneAndUpdate(
    { id },
    {
      $set: {
        title,
        slug,
        category,
        published_at,
        rank: sort_order,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteMostRead(id) {
  return MostRead.findOneAndDelete({ id }).lean()
}

