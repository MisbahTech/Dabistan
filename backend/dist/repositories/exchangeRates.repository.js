import { ExchangeRate } from '../models/ExchangeRate.js';
import { getNextId } from '../utils/counter.js';
import { toSearchRegex } from '../utils/mongo.js';
export async function listExchangeRates(options = {}) {
    const filter = {};
    if (options.q) {
        const regex = toSearchRegex(options.q);
        if (regex) {
            filter.$or = [{ currency: regex }, { base: regex }];
        }
    }
    let query = ExchangeRate.find(filter).sort({ id: 1 }).lean();
    if (options.offset)
        query = query.skip(options.offset);
    if (options.limit)
        query = query.limit(options.limit);
    const data = await query;
    if (options.withTotal) {
        const total = await ExchangeRate.countDocuments(filter);
        return { data, total };
    }
    return data;
}
export async function getExchangeRateById(id) {
    return ExchangeRate.findOne({ id }).lean();
}
export async function createExchangeRate({ currency, rate, base }) {
    const id = await getNextId('exchange_rates');
    const exchangeRate = await ExchangeRate.create({
        id,
        currency,
        rate,
        base,
    });
    return exchangeRate.toJSON();
}
export async function updateExchangeRate(id, data) {
    return ExchangeRate.findOneAndUpdate({ id }, { $set: data }, { new: true }).lean();
}
export async function deleteExchangeRate(id) {
    return ExchangeRate.findOneAndDelete({ id }).lean();
}
//# sourceMappingURL=exchangeRates.repository.js.map