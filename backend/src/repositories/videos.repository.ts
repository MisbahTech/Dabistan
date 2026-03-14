import { Video, IVideo } from '../models/Video.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListVideosOptions {
  sectionSlug?: string
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListVideosResult {
  data: IVideo[]
  total?: number
}

export async function listVideos(options: ListVideosOptions = {}): Promise<IVideo[] | ListVideosResult> {
  const filter: any = {}

  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }
  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ title: regex }, { description: regex }]
    }
  }

  let query = Video.find(filter).sort({ published_at: -1, id: -1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Video.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getVideoById(id: number): Promise<IVideo | null> {
  return Video.findOne({ id }).lean()
}

export interface CreateVideoData {
  title: string
  url: string
  image?: string | null
  category: string
  duration?: string | null
  published_at?: Date | null
  description?: string | null
}

export async function createVideo({ title, url, image, category, duration, published_at, description }: CreateVideoData): Promise<any> {
  const id = await getNextId('videos')
  const video = await Video.create({
    id,
    title,
    url,
    thumbnail: image,
    category,
    duration,
    published_at,
    description,
  })
  return video.toJSON()
}

export async function updateVideo(id: number, data: Partial<CreateVideoData> & { image?: string | null }): Promise<IVideo | null> {
  const update: any = { ...data }
  if ('image' in data) {
    update.thumbnail = data.image
    delete update.image
  }

  return Video.findOneAndUpdate(
    { id },
    { $set: update },
    { new: true }
  ).lean()
}

export async function deleteVideo(id: number): Promise<IVideo | null> {
  return Video.findOneAndDelete({ id }).lean()
}
