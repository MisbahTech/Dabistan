import { Contact } from '../models/Contact.js'
import { applyPagination, toSearchRegex } from '../utils/mongo.js'

export async function listContacts(options = {}) {
  const filter = {}

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

export async function getContactById(id) {
  return Contact.findOne({ id }).lean()
}

export async function createContact({ id, label, href, sort_order }) {
  const contact = await Contact.create({
    id,
    label,
    href,
    sort_order: Number.isInteger(sort_order) ? sort_order : 0,
  })
  return contact.toJSON()
}

export async function updateContact(id, { label, href, sort_order }) {
  return Contact.findOneAndUpdate(
    { id },
    {
      $set: {
        label,
        href,
        sort_order: Number.isInteger(sort_order) ? sort_order : 0,
      },
    },
    { new: true }
  ).lean()
}

export async function deleteContact(id) {
  return Contact.findOneAndDelete({ id }).lean()
}

