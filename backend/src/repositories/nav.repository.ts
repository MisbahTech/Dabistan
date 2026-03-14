import { NavLink, INavLink } from '../models/NavLink.js'
import { getNextId } from '../utils/counter.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListNavLinksOptions {
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListNavLinksResult {
  data: INavLink[]
  total?: number
}

export async function listNavLinks(options: ListNavLinksOptions = {}): Promise<INavLink[] | ListNavLinksResult> {
  const filter: any = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ nav_key: regex }, { label: regex }]
    }
  }

  let query = NavLink.find(filter).sort({ sort_order: 1, id: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await NavLink.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getNavLinkById(id: number): Promise<INavLink | null> {
  return NavLink.findOne({ id }).lean()
}

export interface CreateNavLinkData {
  nav_key: string
  path: string
  label: string
  sort_order?: number
}

export async function createNavLink({ nav_key, path, label, sort_order }: CreateNavLinkData): Promise<any> {
  const id = await getNextId('nav_links')
  const navLink = await NavLink.create({
    id,
    nav_key,
    path,
    label,
    sort_order: Number.isInteger(sort_order) ? sort_order : 0,
  })
  return navLink.toJSON()
}

export async function updateNavLink(id: number, data: Partial<CreateNavLinkData>): Promise<INavLink | null> {
  return NavLink.findOneAndUpdate(
    { id },
    {
      $set: {
        ...data,
        sort_order: Number.isInteger(data.sort_order) ? data.sort_order : undefined,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteNavLink(id: number): Promise<INavLink | null> {
  return NavLink.findOneAndDelete({ id }).lean()
}
