import { MediaItem } from '../models/MediaItem.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listMediaItems(options = {}) {
  const filter = {}

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

export async function getMediaItemById(id) {
  return MediaItem.findOne({ id }).lean()
}

export async function createMediaItem({ section_slug, media_type, title, url, duration, text }) {
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

export async function updateMediaItem(id, { section_slug, media_type, title, url, duration, text }) {
  return MediaItem.findOneAndUpdate(
    { id },
    {
      $set: {
        section_slug,
        media_type,
        title,
        url,
        duration,
        text,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteMediaItem(id) {
  return MediaItem.findOneAndDelete({ id }).lean()
}

