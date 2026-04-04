import { NavLink } from '../models/NavLink.js';
import { getNextId } from '../utils/counter.js';
import { toSearchRegex } from '../utils/mongo.js';
export async function listNavLinks(options = {}) {
    const filter = {};
    if (options.q) {
        const regex = toSearchRegex(options.q);
        if (regex) {
            filter.$or = [{ nav_key: regex }, { label: regex }];
        }
    }
    let query = NavLink.find(filter).sort({ sort_order: 1, id: 1 }).lean();
    if (options.offset)
        query = query.skip(options.offset);
    if (options.limit)
        query = query.limit(options.limit);
    const data = await query;
    if (options.withTotal) {
        const total = await NavLink.countDocuments(filter);
        return { data, total };
    }
    return data;
}
export async function getNavLinkById(id) {
    return NavLink.findOne({ id }).lean();
}
export async function createNavLink({ nav_key, path, label, sort_order }) {
    const id = await getNextId('nav_links');
    const navLink = await NavLink.create({
        id,
        nav_key,
        path,
        label,
        sort_order: Number.isInteger(sort_order) ? sort_order : 0,
    });
    return navLink.toJSON();
}
export async function updateNavLink(id, data) {
    return NavLink.findOneAndUpdate({ id }, {
        $set: {
            ...data,
            sort_order: Number.isInteger(data.sort_order) ? data.sort_order : undefined,
        },
    }, { new: true }).lean();
}
export async function deleteNavLink(id) {
    return NavLink.findOneAndDelete({ id }).lean();
}
//# sourceMappingURL=nav.repository.js.map