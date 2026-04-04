import winston from 'winston';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};
const levelColors = {
    error: chalk.red.bold,
    warn: chalk.yellow.bold,
    info: chalk.cyan,
    http: chalk.magenta,
    debug: chalk.blue,
};
const format = winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const colorizer = levelColors[level] || chalk.white;
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${chalk.gray(`[${timestamp}]`)} ${colorizer(level.toUpperCase().padEnd(5))}: ${message}${metaString}`;
}));
const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error',
    }),
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/all.log') }),
];
export const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
//# sourceMappingURL=logger.js.map