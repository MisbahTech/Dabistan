import { MostRead } from '../models/MostRead.js';
import { getNextId } from '../utils/counter.js';
import { toSearchRegex } from '../utils/mongo.js';
export async function listMostRead(options = {}) {
    const filter = {};
    if (options.q) {
        const regex = toSearchRegex(options.q);
        if (regex) {
            filter.$or = [{ title: regex }, { slug: regex }];
        }
    }
    let query = MostRead.find(filter).sort({ rank: 1, id: 1 }).lean();
    if (options.offset)
        query = query.skip(options.offset);
    if (options.limit)
        query = query.limit(options.limit);
    const data = await query;
    if (options.withTotal) {
        const total = await MostRead.countDocuments(filter);
        return { data, total };
    }
    return data;
}
export async function getMostReadById(id) {
    return MostRead.findOne({ id }).lean();
}
export async function createMostRead({ title, slug, rank, published_at }) {
    const id = await getNextId('most_read');
    const mostRead = await MostRead.create({
        id,
        title,
        slug,
        rank,
        published_at,
    });
    return mostRead.toJSON();
}
export async function updateMostRead(id, data) {
    return MostRead.findOneAndUpdate({ id }, { $set: data }, { new: true }).lean();
}
export async function deleteMostRead(id) {
    return MostRead.findOneAndDelete({ id }).lean();
}
//# sourceMappingURL=mostRead.repository.js.map