import { Router } from 'express';
import { createContact, deleteContact, getContact, listContacts, updateContact } from '../controllers/contacts.controller.js';
export const contactsRouter = Router();
contactsRouter.get('/', listContacts);
contactsRouter.get('/:id', getContact);
contactsRouter.post('/', createContact);
contactsRouter.put('/:id', updateContact);
contactsRouter.delete('/:id', deleteContact);
//# sourceMappingURL=contacts.routes.js.map