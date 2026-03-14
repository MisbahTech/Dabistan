import { MostRead, IMostRead } from '../models/MostRead.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListMostReadOptions {
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListMostReadResult {
  data: IMostRead[]
  total?: number
}

export async function listMostRead(options: ListMostReadOptions = {}): Promise<IMostRead[] | ListMostReadResult> {
  const filter: any = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { slug: regex }]
    }
  }

  let query = MostRead.find(filter).sort({ rank: 1, id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await MostRead.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getMostReadById(id: number): Promise<IMostRead | null> {
  return MostRead.findOne({ id }).lean()
}

export interface CreateMostReadData {
  title: string
  slug: string
  rank: number
  published_at?: Date | null
}

export async function createMostRead({ title, slug, rank, published_at }: CreateMostReadData): Promise<any> {
  const id = await getNextId('most_read')
  const mostRead = await MostRead.create({
    id,
    title,
    slug,
    rank,
    published_at,
  })
  return mostRead.toJSON()
}

export async function updateMostRead(id: number, data: Partial<CreateMostReadData>): Promise<IMostRead | null> {
  return MostRead.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteMostRead(id: number): Promise<IMostRead | null> {
  return MostRead.findOneAndDelete({ id }).lean()
}
