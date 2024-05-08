import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import process from 'node:process';

try {
  const { default: run } = await import(process.argv[2]);
  process.on('message', async ({ type, body, query, stdin }) => {
    if (type === 'input') {
      try {
        const args = stdin ? [process.stdin, query] : [body, query];
        const output = await run(...args);
        if (output instanceof Readable) {
          if (output.closed) {
            process.send({ type: 'output', data: null });
          } else {
            const fd3 = createWriteStream(null, { fd: 3 });
            fd3.once('error', (err) => process.send({ type: 'error', data: err }));
            output.pipe(fd3);
          }
        } else {
          process.send({ type: 'output', data: output });
        }
      } catch (err) {
        process.send({ type: 'error', data: err });
      }
    }
  });
} catch (err) {
  process.send({ type: 'error', data: err });
}
