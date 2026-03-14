import { MediaItem, IMediaItem } from '../models/MediaItem.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListMediaItemsOptions {
  sectionSlug?: string
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListMediaItemsResult {
  data: IMediaItem[]
  total?: number
}

export async function listMediaItems(options: ListMediaItemsOptions = {}): Promise<IMediaItem[] | ListMediaItemsResult> {
  const filter: any = {}

  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }
  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.title = regex
    }
  }

  let query = MediaItem.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await MediaItem.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getMediaItemById(id: number): Promise<IMediaItem | null> {
  return MediaItem.findOne({ id }).lean()
}

export interface CreateMediaItemData {
  section_slug: string
  media_type: 'image' | 'video'
  title: string
  url?: string | null
  duration?: string | null
  text?: string | null
}

export async function createMediaItem({ section_slug, media_type, title, url, duration, text }: CreateMediaItemData): Promise<any> {
  const id = await getNextId('media_items')
  const mediaItem = await MediaItem.create({
    id,
    section_slug,
    media_type,
    title,
    url,
    duration,
    text,
  })
  return mediaItem.toJSON()
}

export async function updateMediaItem(id: number, data: Partial<CreateMediaItemData>): Promise<IMediaItem | null> {
  return MediaItem.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteMediaItem(id: number): Promise<IMediaItem | null> {
  return MediaItem.findOneAndDelete({ id }).lean()
}
