/**
 * Settings for winston
 */
import path from 'path';
import {
  addColors, createLogger, transports, format,
} from 'winston';

const loggerFormat = format.printf((info) => (
  `[${info.timestamp}] [${info.level}]: - ${info.message}`
));

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    http: 2,
    db: 3,
    info: 4,
    debug: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    http: 'yellow',
    db: 'cyan',
    info: 'green',
    debug: 'magenta',
  },
};

addColors(customLevels.colors);

const logger = createLogger({
  levels: customLevels.levels,
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.splat(),
        format.timestamp(),
        format.colorize({ all: true }),
        loggerFormat,
      ),
    }),
    new transports.File({
      level: 'error',
      filename: path.resolve(__dirname, '..', 'logs', 'error.log'),
      maxsize: 5242880,
      handleExceptions: true,
      format: format.combine(
        format.splat(),
        format.simple(),
        format.json(),
      ),
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.log('http', message.replace(/(\r\n|\r|\n)$/, ''));
  },
};
