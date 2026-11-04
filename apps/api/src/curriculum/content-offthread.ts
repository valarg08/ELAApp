import { existsSync } from 'node:fs';
import { Worker } from 'node:worker_threads';
import { loadContent, type LoadResult } from './content-loader.js';

const WORKER = new URL('./content-worker.js', import.meta.url);

/** True where the compiled worker exists (not when tests run from src). */
export const contentWorkerAvailable = () => existsSync(WORKER);

/**
 * loadContent in a worker thread, so the math checks never freeze the API. Where the compiled worker
 * doesn't exist (tests run from src), it loads in this thread instead.
 */
export function loadContentOffThread(): Promise<LoadResult> {
  if (!contentWorkerAvailable()) return loadContent();
  return new Promise((resolve, reject) => {
    const worker = new Worker(WORKER);
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => reject(new Error(`content worker exited with code ${code}`)));
  });
}
