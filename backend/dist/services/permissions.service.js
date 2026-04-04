import * as permissionsRepository from '../repositories/permissions.repository.js';
export const permissionsService = {
    list(options = {}) {
        return permissionsRepository.listPermissions(options);
    },
    getById(id) {
        return permissionsRepository.getPermissionById(id);
    },
    getBySlug(slug) {
        return permissionsRepository.findPermissionBySlug(slug);
    },
    create(data) {
        return permissionsRepository.createPermission(data);
    },
    update(id, data) {
        return permissionsRepository.updatePermission(id, data);
    },
    remove(id) {
        return permissionsRepository.deletePermission(id);
    },
    ensureDefaults() {
        return permissionsRepository.ensureDefaultPermissions();
    }
};
//# sourceMappingURL=permissions.service.js.map