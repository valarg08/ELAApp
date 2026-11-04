import { parentPort } from 'node:worker_threads';
import { loadContent } from './content-loader.js';

/** Worker thread entry: validate /content (about 40 s of math checks) away from the API's event loop. */
parentPort?.postMessage(await loadContent());
