import { accessSync } from 'node:fs';
import { Readable } from 'node:stream';
import express from 'express';
import busboy from 'busboy';
import config from './config.js';
import { createJob } from './runner.js';
import { join } from 'node:path';

const router = express.Router();

router.post('*', async function (req, res, next) {
  try {
    const { rootDir, requestSize } = config;
    const { path, body, query, headers } = req;
    const contentLength = headers['content-length'] || 0;
    if (contentLength > requestSize * 1024 * 1024) {
      throw Error('Content length is too long');
    }
    let input = body;
    if (headers['content-type']?.includes('multipart/form-data')) {
      const bb = busboy({
        headers,
        limits: {
          files: 1,
          fileSize: requestSize * 1024 * 1024
        }
      });
      input = await new Promise((resolve, reject) => {
        bb.once('file', (name, file) => resolve(file));
        // bb.on('field', (name, val) => resolve());
        bb.once('error', (err) => reject(err));
        bb.once('close', () => resolve());
        req.pipe(bb);
      });
    }
    if (/node_modules|\/\./u.test(path)) {
      throw Error('Not allowed');
    }
    const script = join(rootDir, path.slice(-1) === '/' ? join(path, 'index.js') : `${path}.js`);
    accessSync(script);
    createJob(script, input, query, (err, output) => {
      if (err) return next(err);
      if (output instanceof Readable) {
        res.flushHeaders();
        res.once('close', () => output.destroy());
        output.pipe(res);
      } else {
        res.send(output);
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
