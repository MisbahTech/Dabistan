import { Counter } from '../models/Counter.js';
export async function getNextId(sequenceName) {
    const result = await Counter.findOneAndUpdate({ _id: sequenceName }, { $inc: { seq: 1 } }, { upsert: true, new: true }).lean();
    if (!result || typeof result.seq !== 'number') {
        throw new Error(`Failed to allocate sequence for ${sequenceName}`);
    }
    return result.seq;
}
//# sourceMappingURL=counter.js.map