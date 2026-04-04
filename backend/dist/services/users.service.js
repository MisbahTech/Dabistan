import * as usersRepository from '../repositories/users.repository.js';
import { hashPassword } from './password.service.js';
export const usersService = {
    list(options = {}) {
        return usersRepository.listUsers(options);
    },
    getById(id) {
        return usersRepository.getUserById(id);
    },
    getByEmail(email) {
        return usersRepository.findUserByEmail(email);
    },
    async create({ name, email, password, role }) {
        const password_hash = await hashPassword(password);
        return usersRepository.createUser({ name, email, password_hash, role });
    },
    update(id, data) {
        return usersRepository.updateUser(id, data);
    },
    async updatePassword(id, password) {
        const password_hash = await hashPassword(password);
        return usersRepository.updateUserPassword(id, password_hash);
    },
    remove(id) {
        return usersRepository.deleteUser(id);
    },
    updateLastLogin(id) {
        return usersRepository.updateLastLogin(id);
    },
};
//# sourceMappingURL=users.service.js.map