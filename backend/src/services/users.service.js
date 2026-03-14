import * as usersRepository from '../repositories/users.repository.js'
import { hashPassword } from './password.service.js'

export const usersService = {
  list(options) {
    return usersRepository.listUsers(options)
  },

  getById(id) {
    return usersRepository.getUserById(id)
  },

  getByEmail(email) {
    return usersRepository.findUserByEmail(email)
  },

  async create({ email, password, role }) {
    const password_hash = await hashPassword(password)
    return usersRepository.createUser({ email, password_hash, role })
  },

  updateRole(id, role) {
    return usersRepository.updateUserRole(id, role)
  },

  async updatePassword(id, password) {
    const password_hash = await hashPassword(password)
    return usersRepository.updateUserPassword(id, password_hash)
  },

  remove(id) {
    return usersRepository.deleteUser(id)
  },

  updateLastLogin(id) {
    return usersRepository.updateLastLogin(id)
  },
}
