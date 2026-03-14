import { Section } from '../models/Section.js'
import { getNextId } from '../utils/counter.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listSections(options = {}) {
  const filter = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ slug: regex }, { title: regex }]
    }
  }

  let query = Section.find(filter).sort({ id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Section.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getSectionById(id) {
  return Section.findOne({ id }).lean()
}

export async function createSection({ slug, title, description }) {
  const id = await getNextId('sections')
  const section = await Section.create({
    id,
    slug,
    title,
    description,
  })
  return section.toJSON()
}

export async function updateSection(id, { slug, title, description }) {
  return Section.findOneAndUpdate(
    { id },
    {
      $set: {
        slug,
        title,
        description,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteSection(id) {
  return Section.findOneAndDelete({ id }).lean()
}

