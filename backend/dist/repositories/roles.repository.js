import { Role } from '../models/Role.js';
import { getNextId } from '../utils/counter.js';
import { toSearchRegex } from '../utils/mongo.js';
import { findPermissionsBySlugs } from './permissions.repository.js';
export async function findRoleBySlug(slug) {
    return Role.findOne({ slug }).populate('permissions').lean();
}
export async function getRoleById(id) {
    return Role.findOne({ id }).populate('permissions').lean();
}
export async function getRoleByObjectId(objectId) {
    return Role.findById(objectId).populate('permissions').lean();
}
export async function listRoles(options = {}) {
    const filter = {};
    if (options.q) {
        const regex = toSearchRegex(options.q);
        if (regex) {
            filter.name = regex;
        }
    }
    let query = Role.find(filter).sort({ id: 1 }).populate('permissions').lean();
    if (options.offset)
        query = query.skip(options.offset);
    if (options.limit)
        query = query.limit(options.limit);
    const data = await query;
    if (options.withTotal) {
        const total = await Role.countDocuments(filter);
        return { data, total };
    }
    return data;
}
export async function createRole(data) {
    const id = await getNextId('roles');
    if (data.permissions && Array.isArray(data.permissions)) {
        const permissionDocs = await findPermissionsBySlugs(data.permissions);
        data.permissions = permissionDocs.map(p => p._id);
    }
    const role = await Role.create({
        ...data,
        id,
    });
    return role.toJSON();
}
export async function updateRole(id, data) {
    if (data.permissions && Array.isArray(data.permissions)) {
        const permissionDocs = await findPermissionsBySlugs(data.permissions);
        data.permissions = permissionDocs.map(p => p._id);
    }
    return Role.findOneAndUpdate({ id }, { $set: data }, { returnDocument: 'after' }).populate('permissions').lean();
}
export async function deleteRole(id) {
    return Role.findOneAndDelete({ id }).lean();
}
import { ensureDefaultPermissions } from './permissions.repository.js';
export async function ensureDefaultRoles() {
    await ensureDefaultPermissions();
    const defaults = [
        { name: 'Admin', slug: 'admin', permissions: ['all'] },
        { name: 'Editor', slug: 'editor', permissions: ['posts.manage', 'categories.manage'] },
    ];
    // 1. Create defaults if they don't exist
    for (const r of defaults) {
        const exists = await Role.findOne({ slug: r.slug }).lean();
        if (!exists) {
            await createRole(r);
        }
    }
    // 2. Generic migration for ALL roles (including defaults and custom ones)
    // We use .lean() to avoid CastError during Mongoose document instantiation
    const allRoles = await Role.find({}).lean();
    for (const role of allRoles) {
        if (!role.permissions)
            continue;
        // Check if any permission is still a string (legacy data)
        const legacySlugs = role.permissions.filter(p => typeof p === 'string');
        if (legacySlugs.length > 0) {
            console.log(`[Migration] Fixing legacy permissions for role: ${role.slug}`);
            const permissionDocs = await findPermissionsBySlugs(legacySlugs);
            const validPermissionIds = permissionDocs.map(p => p._id);
            // We might have legacy strings that don't match any new Permission slug
            // In that case, we should probably keep them as is or remove them, 
            // but Mongoose will error if we try to save them as ObjectIds.
            // For now, we only save the valid ObjectIds we found.
            await Role.updateOne({ _id: role._id }, { $set: { permissions: validPermissionIds } });
            console.log(`[Migration] Migrated ${validPermissionIds.length} permissions for ${role.slug}`);
        }
    }
}
//# sourceMappingURL=roles.repository.js.map