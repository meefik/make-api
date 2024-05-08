import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { fork } from 'node:child_process';
import config from './config.js';
import logger from './logger.js';

const queue = [];
let doing = 0;

function jobProcessor () {
  const { concurrent, execTimeout } = config;
  if (queue.length && doing < concurrent) {
    const job = queue.shift();
    doing++;
    const cb = (err, data) => {
      if (err) {
        logger.error(err, { label: 'runner' });
      }
      if (job.cb) {
        const callback = job.cb;
        delete job.cb;
        try {
          callback(err, data);
        } catch (err) {
          logger.error(err, { label: 'runner' });
        }
        doing--;
        setImmediate(jobProcessor);
      }
    };
    try {
      const wrapper = join(dirname(fileURLToPath(import.meta.url)), 'worker.js');
      const worker = fork(wrapper, [job.path], {
        stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'ipc'],
        serialization: 'advanced',
        timeout: execTimeout * 1000
      });
      worker.once('error', (err) => cb(err));
      worker.once('exit', () => cb());
      const fd3 = worker.stdio[3];
      fd3.once('readable', () => cb(null, fd3));
      fd3.once('error', (err) => cb(err));
      fd3.once('end', () => {
        if (!worker.killed) {
          worker.kill('SIGTERM');
        }
      });
      worker.on('message', ({ type, data }) => {
        if (type === 'output') {
          cb(null, data);
          worker.kill('SIGTERM');
        } else if (type === 'error') {
          cb(data);
          worker.kill('SIGTERM');
        }
      });
      worker.stdout.on('data', (data) => {
        // remove a new line
        if (data[data.length - 1] === 10) {
          data = data.slice(0, -1);
        }
        logger.info(data, { label: 'runner' });
      });
      worker.stderr.on('data', (data) => {
        // remove a new line
        if (data[data.length - 1] === 10) {
          data = data.slice(0, -1);
        }
        logger.error(data, { label: 'runner' });
      });
      if (job.body instanceof Readable) {
        if (job.body.closed) {
          worker.send({ type: 'input', body: null, query: job.query });
        } else {
          const { stdin } = worker;
          stdin.once('error', (err) => cb(err));
          job.body.pipe(stdin);
          worker.send({ type: 'input', query: job.query, stdin: true });
        }
      } else {
        worker.send({ type: 'input', body: job.body, query: job.query });
      }
    } catch (err) {
      cb(err);
    }
  }
}

export function createJob (path, body, query, cb) {
  const { queueSize } = config;
  if (queue.length >= queueSize) {
    throw Error('Queue size limit exceeded');
  }
  const job = { path, body, query, cb };
  queue.push(job);
  setImmediate(jobProcessor);
}
