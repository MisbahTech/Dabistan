import { Router } from 'express';
import { getLatestWeather, getWeatherHistory, updateWeather, cleanupWeather } from '../controllers/weather.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
export const weatherRouter = Router();
weatherRouter.use(requireAuth);
weatherRouter.use(requireRole(['admin', 'editor']));
weatherRouter.get('/', getLatestWeather);
weatherRouter.get('/history', getWeatherHistory);
weatherRouter.post('/', updateWeather);
weatherRouter.delete('/cleanup', cleanupWeather);
//# sourceMappingURL=weather.routes.js.map