import * as contactsRepository from '../repositories/contacts.repository.js'
import { IContact } from '../models/Contact.js'

export const contactsService = {
  list(options: contactsRepository.ListContactsOptions = {}): Promise<IContact[] | contactsRepository.ListContactsResult> {
    return contactsRepository.listContacts(options)
  },

  getById(id: number): Promise<IContact | null> {
    return contactsRepository.getContactById(id)
  },

  create(payload: contactsRepository.CreateContactData): Promise<any> {
    return contactsRepository.createContact(payload)
  },

  update(id: number, payload: Partial<contactsRepository.CreateContactData>): Promise<IContact | null> {
    return contactsRepository.updateContact(id, payload)
  },

  remove(id: number): Promise<IContact | null> {
    return contactsRepository.deleteContact(id)
  },
}
