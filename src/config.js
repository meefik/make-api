import { cwd } from 'node:process';

export default {
  rootDir: cwd(),
  port: 8000,
  concurrent: 1,
  execTimeout: 300,
  queueSize: 100,
  requestSize: 100
};
