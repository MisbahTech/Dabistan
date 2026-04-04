import { weatherService } from '../services/weather.service.js';
import { requireBody, requireFieldsFor } from '../utils/handlers.js';
export async function getLatestWeather(req, res, next) {
    try {
        const data = await weatherService.getLatest();
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function getWeatherHistory(req, res, next) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
        const data = await weatherService.getHistory(limit);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function updateWeather(req, res, next) {
    try {
        requireBody(req);
        requireFieldsFor(req.body, ['location', 'temperature', 'condition']);
        const data = await weatherService.update(req.body);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
export async function cleanupWeather(req, res, next) {
    try {
        const days = req.query.days ? parseInt(req.query.days, 10) : undefined;
        await weatherService.cleanup(days);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=weather.controller.js.map