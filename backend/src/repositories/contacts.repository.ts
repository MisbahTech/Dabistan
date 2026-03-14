import { Contact, IContact } from '../models/Contact.js'
import { toSearchRegex } from '../utils/mongo.js'

export interface ListContactsOptions {
  q?: string
  offset?: number
  limit?: number
  withTotal?: boolean
}

export interface ListContactsResult {
  data: IContact[]
  total?: number
}

export async function listContacts(options: ListContactsOptions = {}): Promise<IContact[] | ListContactsResult> {
  const filter: any = {}

  if (options.q) {
    const regex = toSearchRegex(options.q)
    if (regex) {
      filter.$or = [{ id: regex }, { label: regex }]
    }
  }

  let query = Contact.find(filter).sort({ sort_order: 1, created_at: 1 }).lean()
  
  if (options.offset) query = query.skip(options.offset)
  if (options.limit) query = query.limit(options.limit)

  const data = await query

  if (options.withTotal) {
    const total = await Contact.countDocuments(filter)
    return { data, total }
  }

  return data
}

export async function getContactById(id: number): Promise<IContact | null> {
  return Contact.findOne({ id }).lean()
}

export interface CreateContactData {
  id: number
  label: string
  href: string
  sort_order?: number
}

export async function createContact({ id, label, href, sort_order }: CreateContactData): Promise<any> {
  const contact = await Contact.create({
    id,
    label,
    href,
    sort_order: Number.isInteger(sort_order) ? sort_order : 0,
  })
  return contact.toJSON()
}

export async function updateContact(id: number, data: Partial<CreateContactData>): Promise<IContact | null> {
  return Contact.findOneAndUpdate(
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

export async function deleteContact(id: number): Promise<IContact | null> {
  return Contact.findOneAndDelete({ id }).lean()
}
