import * as rolesRepository from '../repositories/roles.repository.js';
export const rolesService = {
    list(options = {}) {
        return rolesRepository.listRoles(options);
    },
    getById(id) {
        return rolesRepository.getRoleById(id);
    },
    getBySlug(slug) {
        return rolesRepository.findRoleBySlug(slug);
    },
    create(data) {
        return rolesRepository.createRole(data);
    },
    update(id, data) {
        return rolesRepository.updateRole(id, data);
    },
    remove(id) {
        return rolesRepository.deleteRole(id);
    },
    ensureDefaults() {
        return rolesRepository.ensureDefaultRoles();
    }
};
//# sourceMappingURL=roles.service.js.map