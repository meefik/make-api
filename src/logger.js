import cluster from 'cluster';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, colorize, printf } = format;

const { NODE_ENV = 'production' } = process.env;

const IS_PROD = NODE_ENV === 'production';
const PRINT_FN = function ({ label, level, message, timestamp }) {
  if (!label) label = 'worker';
  return `${timestamp} ${level} [${label}${
    cluster.isWorker ? `-${cluster.worker.id}` : ''
  }]: ${message}`;
};

const logger = createLogger({
  level: IS_PROD ? 'info' : 'debug',
  format: IS_PROD
    ? combine(timestamp(), printf(PRINT_FN))
    : combine(timestamp(), colorize(), printf(PRINT_FN)),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
      handleExceptions: false
    })
  ],
  exitOnError: false
});

export default logger;
