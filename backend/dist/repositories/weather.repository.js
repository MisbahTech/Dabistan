import { Weather } from '../models/Weather.js';
import { getNextId } from '../utils/counter.js';
export async function getWeather() {
    return Weather.findOne({}).sort({ updated_at: -1 }).lean();
}
export async function listWeatherHistory(limit = 10) {
    return Weather.find({}).sort({ updated_at: -1 }).limit(limit).lean();
}
export async function updateWeather({ location, temperature, condition, icon }) {
    const id = await getNextId('weather');
    const weather = await Weather.create({
        id,
        location,
        temperature,
        condition,
        icon,
    });
    return weather.toJSON();
}
export async function deleteOldWeatherData(days = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    await Weather.deleteMany({ created_at: { $lt: date } });
}
//# sourceMappingURL=weather.repository.js.map