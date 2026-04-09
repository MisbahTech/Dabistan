import { MostRead } from '../models/MostRead.js';
import { Post } from '../models/Post.js';
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
export async function syncMostReadFromPublishedPosts(limit = 10) {
    const posts = await Post.find({ status: 'published' })
        .sort({ view_count: -1, published_at: -1, id: -1 })
        .limit(limit)
        .select('title slug published_at')
        .lean();
    const slugs = posts.map((post) => post.slug).filter(Boolean);
    if (!slugs.length) {
        await MostRead.deleteMany({});
        return [];
    }
    await MostRead.deleteMany({ slug: { $nin: slugs } });
    const existingItems = await MostRead.find({ slug: { $in: slugs } }).lean();
    const existingBySlug = new Map(existingItems.map((item) => [item.slug, item]));
    for (const [index, post] of posts.entries()) {
        const payload = {
            title: post.title,
            slug: post.slug,
            rank: index + 1,
            published_at: post.published_at ?? null,
        };
        const existing = existingBySlug.get(post.slug);
        if (existing) {
            await MostRead.updateOne({ id: existing.id }, { $set: payload });
            continue;
        }
        await MostRead.create({
            id: await getNextId('most_read'),
            ...payload,
        });
    }
    return MostRead.find({}).sort({ rank: 1, id: 1 }).lean();
}
//# sourceMappingURL=mostRead.repository.js.map