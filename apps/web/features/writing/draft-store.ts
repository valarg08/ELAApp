'use client';

import type { PendingDraft, PendingStore } from './autosave';

/**
 * Unsaved drafts kept in IndexedDB until the server confirms them. Entries are cleared after a
 * successful save and on logout (shared classroom devices). If IndexedDB is unavailable (private
 * mode, old browser) everything still works, just without the offline safety net.
 */

const DB_NAME = 'storyforge-drafts';
const STORE = 'pending';

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  dbPromise ??= new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.addEventListener('upgradeneeded', () => req.result.createObjectStore(STORE));
      req.addEventListener('success', () => resolve(req.result));
      req.addEventListener('error', () => resolve(null));
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

async function run(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest,
): Promise<unknown> {
  const db = await openDb();
  if (!db) return undefined;
  return new Promise((resolve) => {
    try {
      const req = action(db.transaction(STORE, mode).objectStore(STORE));
      req.addEventListener('success', () => resolve(req.result));
      req.addEventListener('error', () => resolve(undefined));
    } catch {
      resolve(undefined);
    }
  });
}

const isPending = (v: unknown): v is PendingDraft =>
  typeof v === 'object' &&
  v !== null &&
  'text' in v &&
  typeof v.text === 'string' &&
  'baseRevision' in v &&
  typeof v.baseRevision === 'number';

export function pendingDraftStore(submissionId: string): PendingStore {
  return {
    async get() {
      const value = await run('readonly', (s) => s.get(submissionId));
      return isPending(value) ? value : undefined;
    },
    async put(draft) {
      await run('readwrite', (s) => s.put(draft, submissionId));
    },
    async clear() {
      await run('readwrite', (s) => s.delete(submissionId));
    },
  };
}

/** Forget every unsaved draft on this device (called on logout). */
export async function clearAllPendingDrafts(): Promise<void> {
  await run('readwrite', (s) => s.clear());
}
