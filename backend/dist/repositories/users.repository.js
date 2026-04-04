import { User } from '../models/User.js';
import { getNextId } from '../utils/counter.js';
import { toSearchRegex } from '../utils/mongo.js';
export async function findUserByEmail(email) {
    try {
        return await User.findOne({ email }).populate('role').select('+password_hash').lean();
    }
    catch (error) {
        if (error.name === 'CastError' && error.path === 'role') {
            // Fallback for legacy string role data
            const rawUser = await User.findOne({ email }).select('+password_hash').lean();
            if (rawUser && typeof rawUser.role === 'string') {
                const roleDoc = await findRoleBySlug(rawUser.role);
                if (roleDoc) {
                    rawUser.role = roleDoc;
                }
            }
            return rawUser;
        }
        throw error;
    }
}
export async function getUserById(id) {
    try {
        return await User.findOne({ id }).populate('role').lean();
    }
    catch (error) {
        if (error.name === 'CastError' && error.path === 'role') {
            const rawUser = await User.findOne({ id }).lean();
            if (rawUser && typeof rawUser.role === 'string') {
                const roleDoc = await findRoleBySlug(rawUser.role);
                if (roleDoc) {
                    rawUser.role = roleDoc;
                }
            }
            return rawUser;
        }
        throw error;
    }
}
export async function listUsers(options = {}) {
    const filter = {};
    if (options.role) {
        filter.role = options.role;
    }
    if (options.q) {
        const regex = toSearchRegex(options.q);
        if (regex) {
            filter.email = regex;
        }
    }
    let query = User.find(filter).sort({ id: 1 }).populate('role').lean();
    if (options.offset)
        query = query.skip(options.offset);
    if (options.limit)
        query = query.limit(options.limit);
    const data = await query;
    if (options.withTotal) {
        const total = await User.countDocuments(filter);
        return { data, total };
    }
    return data;
}
import { findRoleBySlug } from './roles.repository.js';
export async function createUser({ name, email, password_hash, role }) {
    const id = await getNextId('users');
    let roleId = role;
    if (typeof role === 'string') {
        const roleDoc = await findRoleBySlug(role);
        if (roleDoc) {
            roleId = roleDoc._id;
        }
        else {
            throw new Error(`Role not found: ${role}`);
        }
    }
    const user = await User.create({
        id,
        name,
        email,
        password_hash,
        role: roleId,
    });
    return user.toJSON();
}
export async function updateUser(id, data) {
    if (data.role && typeof data.role === 'string') {
        const roleDoc = await findRoleBySlug(data.role);
        if (roleDoc) {
            data.role = roleDoc._id;
        }
        else {
            throw new Error(`Role not found: ${data.role}`);
        }
    }
    return User.findOneAndUpdate({ id }, { $set: data }, { returnDocument: 'after' }).populate('role').lean();
}
export async function updateUserPassword(id, password_hash) {
    return User.findOneAndUpdate({ id }, { $set: { password_hash } }, { returnDocument: 'after' }).lean();
}
export async function deleteUser(id) {
    return User.findOneAndDelete({ id }).lean();
}
export async function updateLastLogin(id) {
    await User.updateOne({ id }, { $set: { last_login_at: new Date() } });
}
//# sourceMappingURL=users.repository.js.map