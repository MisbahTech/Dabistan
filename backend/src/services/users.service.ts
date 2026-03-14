import * as usersRepository from '../repositories/users.repository.js'
import { IUser } from '../models/User.js'

import { hashPassword } from './password.service.js'

export const usersService = {
  list(options: usersRepository.ListUsersOptions = {}): Promise<IUser[] | usersRepository.ListUsersResult> {
    return usersRepository.listUsers(options)
  },

  getById(id: number): Promise<IUser | null> {
    return usersRepository.getUserById(id)
  },

  getByEmail(email: string): Promise<IUser | null> {
    return usersRepository.findUserByEmail(email)
  },

  async create({ email, password, role }: { email: string; password: string; role: string }): Promise<any> {
    const password_hash = await hashPassword(password)
    return usersRepository.createUser({ email, password_hash, role })
  },

  updateRole(id: number, role: string): Promise<IUser | null> {
    return usersRepository.updateUserRole(id, role)
  },

  async updatePassword(id: number, password: string): Promise<IUser | null> {
    const password_hash = await hashPassword(password)
    return usersRepository.updateUserPassword(id, password_hash)
  },

  remove(id: number): Promise<IUser | null> {
    return usersRepository.deleteUser(id)
  },

  updateLastLogin(id: number): Promise<void> {
    return usersRepository.updateLastLogin(id)
  },
}
