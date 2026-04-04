import * as weatherRepository from '../repositories/weather.repository.js';
export const weatherService = {
    getLatest() {
        return weatherRepository.getWeather();
    },
    getHistory(limit) {
        return weatherRepository.listWeatherHistory(limit);
    },
    update(payload) {
        return weatherRepository.updateWeather(payload);
    },
    cleanup(days) {
        return weatherRepository.deleteOldWeatherData(days);
    },
};
//# sourceMappingURL=weather.service.js.map