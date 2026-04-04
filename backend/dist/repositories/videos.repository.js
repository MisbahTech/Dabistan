import { Video } from '../models/Video.js';
import { getNextId } from '../utils/counter.js';
import { toSearchRegex } from '../utils/mongo.js';
export async function listVideos(options = {}) {
    const filter = {};
    if (options.sectionSlug) {
        filter.section_slug = options.sectionSlug;
    }
    if (options.q) {
        const regex = toSearchRegex(options.q);
        if (regex) {
            filter.$or = [{ title: regex }, { description: regex }];
        }
    }
    let query = Video.find(filter).sort({ published_at: -1, id: -1 }).lean();
    if (options.offset)
        query = query.skip(options.offset);
    if (options.limit)
        query = query.limit(options.limit);
    const data = await query;
    if (options.withTotal) {
        const total = await Video.countDocuments(filter);
        return { data, total };
    }
    return data;
}
export async function getVideoById(id) {
    return Video.findOne({ id }).lean();
}
export async function createVideo({ title, url, image, category, duration, published_at, description }) {
    const id = await getNextId('videos');
    const video = await Video.create({
        id,
        title,
        url,
        thumbnail: image,
        category,
        duration,
        published_at,
        description,
    });
    return video.toJSON();
}
export async function updateVideo(id, data) {
    const update = { ...data };
    if ('image' in data) {
        update.thumbnail = data.image;
        delete update.image;
    }
    return Video.findOneAndUpdate({ id }, { $set: update }, { new: true }).lean();
}
export async function deleteVideo(id) {
    return Video.findOneAndDelete({ id }).lean();
}
//# sourceMappingURL=videos.repository.js.map