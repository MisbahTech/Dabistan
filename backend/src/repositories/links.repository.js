import { Link } from '../models/Link.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listLinks(options = {}) {
  const filter = {}

  if (options.sectionSlug) {
    filter.section_slug = options.sectionSlug
  }

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.label = regex
    }
  }

  let query = Link.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Link.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getLinkById(id) {
  return Link.findOne({ id }).lean()
}

export async function createLink({ section_slug, label, href }) {
  const id = await getNextId('links')
  const link = await Link.create({
    id,
    section_slug,
    label,
    href,
  })
  return link.toJSON()
}

export async function updateLink(id, { section_slug, label, href }) {
  return Link.findOneAndUpdate(
    { id },
    {
      $set: {
        section_slug,
        label,
        href,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteLink(id) {
  return Link.findOneAndDelete({ id }).lean()
}

