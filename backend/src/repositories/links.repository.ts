import { Link, ILink } from '../models/Link.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListLinksOptions {
  sectionSlug?: string
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListLinksResult {
  data: ILink[]
  total?: number
}

export async function listLinks(options: ListLinksOptions = {}): Promise<ILink[] | ListLinksResult> {
  const filter: any = {}

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

export async function getLinkById(id: number): Promise<ILink | null> {
  return Link.findOne({ id }).lean()
}

export interface CreateLinkData {
  section_slug: string
  label: string
  href: string
}

export async function createLink({ section_slug, label, href }: CreateLinkData): Promise<any> {
  const id = await getNextId('links')
  const link = await Link.create({
    id,
    section_slug,
    label,
    href,
  })
  return link.toJSON()
}

export async function updateLink(id: number, data: Partial<CreateLinkData>): Promise<ILink | null> {
  return Link.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteLink(id: number): Promise<ILink | null> {
  return Link.findOneAndDelete({ id }).lean()
}
