import http from 'node:http';
import https from 'node:https';
import { readFileSync } from 'node:fs';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import config from './config.js';
import logger from './logger.js';
import api from './api.js';

export default function (options = {}) {
  Object.assign(config, options);

  const {
    port,
    host,
    apiKey,
    sslKey,
    sslCert,
    sslCA
  } = config;

  const app = express();

  app.enable('trust proxy');
  app.disable('x-powered-by');
  app.use(compression());
  app.use(cors({ origin: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.text());
  app.use(express.json());
  app.use(express.raw());

  app.use(morgan(function (tokens, req, res) {
    const ip = req.ip;
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const statusCode = tokens.status(req, res) || '-';
    const statusMessage = res.statusMessage || '';
    const size = tokens.res(req, res, 'content-length') || 0;
    const time = ~~tokens['response-time'](req, res);
    const message = `${ip} - ${method} ${url} ${statusCode} (${statusMessage}) ${size} bytes - ${time} ms`;
    const label = req.protocol;
    let level;
    if (res.statusCode >= 500) {
      level = 'error';
    } else if (res.statusCode >= 400) {
      level = 'warn';
    } else if (res.statusCode >= 100) {
      level = 'info';
    } else {
      level = 'verbose';
    }
    logger.log({ level, label, message });
  }));

  app.use(function (req, res, next) {
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      res.status(401);
      next(new Error('Unauthorized'));
    } else {
      next();
    }
  });

  app.use(api);

  app.use(function (req, res, next) {
    res.status(404);
    next(new Error('Not found'));
  });

  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (typeof err !== 'object') {
      err = new Error(err);
    }
    res.json({ name: err.name, message: err.message, code: err.code });
  });

  const server = sslKey && sslCert
    ? https.Server({
      key: readFileSync(sslKey),
      cert: readFileSync(sslCert),
      ca: sslCA && readFileSync(sslCA)
    }, app)
    : http.Server(app);

  server.listen(port, host, function () {
    const address = this.address();
    logger.info({
      label: 'server',
      message: `Listening on ${address.address}:${address.port}`
    });
  });

  // Graceful shutdown
  ['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal) => {
    process.once(signal, () => Promise.all([
      new Promise((resolve) => server.close(resolve))
    ])
      .catch((err) => logger.error(err, { label: 'server' }))
      .finally(() => process.exit(0)));
  });

  // Uncaught exception handler
  process.on('uncaughtException', (err) => logger.error(err, { lable: 'server' }));
}
