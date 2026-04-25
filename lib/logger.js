const winston = require('winston');
require('colors');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            const levels = {
                info: level.info,
                error: level.error,
                warn: level.warn,
                debug: level.debug
            };
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            )
        }),
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            format: winston.format.json()
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            format: winston.format.json()
        })
    ]
});

module.exports = logger;
