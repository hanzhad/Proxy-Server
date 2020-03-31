import _ from 'lodash';
import moment from 'moment';
import logger from './logger';

/**
 * Provide an ability to exclude logs
 *
 * @type {RegExp[]}
 */
const regexs = [
  /(.+)\.(js|css|woff.?|png|ico)$/g,
  /X_LOCAL_SECURITY_COOKIE/g,
];

/**
 * Provide an ability to exclude logs by urls
 *
 * @type {String[]}
 */
const urlsWithDisabledLogs = [

];

/**
 * Provide an ability to show logs on start of request
 *
 * @type {String[]}
 */
const urlsThatIsShowedOnStart = [

];

/**
 * Provide an ability to show logs without format
 *
 * @type {String[]}
 */
const devUrls = [

];

const writeLog = (req, log) => {
  logger.http(log);
};

/**
 * Middleware displays formatted request logs in console
 *
 * @param req
 * @param res
 * @param next
 */
const requestLogger = (req, res, next) => {
  const { method, originalUrl } = req;
  const start = Date.now();

  const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (_.some(regexs, (x) => originalUrl.match(x))) {
    return next();
  }

  if (_.some(urlsWithDisabledLogs, (x) => _.includes(originalUrl, x))) {
    return next();
  }

  if (_.some(devUrls, (x) => _.includes(originalUrl, x))) {
    console.info(`[${moment().toISOString()}] - ${clientIp} - [DEV_LOG] ${method} ${originalUrl}`);
  }

  if (_.some(urlsThatIsShowedOnStart, (x) => _.includes(originalUrl, x))) {
    writeLog(req, `${clientIp} - ${method} ${originalUrl} - Request started.`);
  }

  res.on('finish', () => {
    const { statusCode, statusMessage } = res;
    const contentSize = res.get('Content-Length') || 0;
    const responseTime = Date.now() - start;
    const log = `${clientIp} - ${method} ${originalUrl} - ${statusCode} [${statusMessage}] (${contentSize}b sent in ${responseTime} ms)`;
    writeLog(req, log);
  });

  return next();
};

export default requestLogger;
