import { Section, ISection } from '../models/Section.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListSectionsOptions {
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListSectionsResult {
  data: ISection[]
  total?: number
}

export async function listSections(options: ListSectionsOptions = {}): Promise<ISection[] | ListSectionsResult> {
  const filter: any = {}

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

export async function getSectionById(id: number): Promise<ISection | null> {
  return Section.findOne({ id }).lean()
}

export async function getSectionBySlug(slug: string): Promise<ISection | null> {
  return Section.findOne({ slug }).lean()
}

export interface CreateSectionData {
  title: string
  slug: string
  description: string
}

export async function createSection({ title, slug, description }: CreateSectionData): Promise<any> {
  const id = await getNextId('sections')
  const section = await Section.create({
    id,
    title,
    slug,
    description,
  })
  return section.toJSON()
}

export async function updateSection(id: number, data: Partial<CreateSectionData>): Promise<ISection | null> {
  return Section.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteSection(id: number): Promise<ISection | null> {
  return Section.findOneAndDelete({ id }).lean()
}
