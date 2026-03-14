import * as contactsRepository from '../repositories/contacts.repository.js'

export const contactsService = {
  list(options) {
    return contactsRepository.listContacts(options)
  },

  getById(id) {
    return contactsRepository.getContactById(id)
  },

  create(payload) {
    return contactsRepository.createContact(payload)
  },

  update(id, payload) {
    return contactsRepository.updateContact(id, payload)
  },

  remove(id) {
    return contactsRepository.deleteContact(id)
  },
}
