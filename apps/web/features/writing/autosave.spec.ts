import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AutosaveController,
  type DraftTransport,
  type PendingDraft,
  type PendingStore,
  type SaveResult,
} from './autosave';

/** A fake server holding one draft, with switchable network. */
function fakeServer(text = '', draftRevision = 0) {
  const server = {
    text,
    draftRevision,
    online: true,
    saves: [] as string[],
    snapshots: [] as string[],
  };
  const transport: DraftTransport = {
    async save(t, base): Promise<SaveResult> {
      if (!server.online) return { ok: false, kind: 'offline' };
      if (base !== server.draftRevision) return { ok: false, kind: 'conflict' };
      server.text = t;
      server.draftRevision += 1;
      server.saves.push(t);
      return {
        ok: true,
        draftRevision: server.draftRevision,
        savedAt: 'now',
        snapshotCreated: false,
      };
    },
    async load() {
      return { text: server.text, draftRevision: server.draftRevision };
    },
    async snapshot(base) {
      if (base === server.draftRevision) server.snapshots.push(server.text);
    },
  };
  return { server, transport };
}

function memoryStore(initial?: PendingDraft) {
  let value = initial;
  const store: PendingStore = {
    get: async () => value,
    put: async (d) => {
      value = d;
    },
    clear: async () => {
      value = undefined;
    },
  };
  return { store, peek: () => value };
}

const make = (server = fakeServer(), pending = memoryStore()) => ({
  ...server,
  ...pending,
  ctrl: new AutosaveController(
    { text: server.server.text, draftRevision: server.server.draftRevision, savedAt: null },
    server.transport,
    pending.store,
  ),
});

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('AutosaveController', () => {
  it('saves 1.5 s after typing stops', async () => {
    const { ctrl, server } = make();
    ctrl.setText('Hello');
    expect(ctrl.getState().status).toBe('unsaved');
    await vi.advanceTimersByTimeAsync(1000);
    ctrl.setText('Hello there');
    await vi.advanceTimersByTimeAsync(1400);
    expect(server.saves).toEqual([]);
    await vi.advanceTimersByTimeAsync(100);
    expect(server.saves).toEqual(['Hello there']);
    expect(ctrl.getState().status).toBe('saved');
  });

  it('saves at least every 10 s while typing continues', async () => {
    const { ctrl, server } = make();
    for (let i = 1; i <= 12; i += 1) {
      ctrl.setText('x'.repeat(i));
      await vi.advanceTimersByTimeAsync(1000);
    }
    expect(server.saves.length).toBeGreaterThanOrEqual(1);
    expect(server.saves[0]).toBe('x'.repeat(10));
  });

  it('keeps text on the device while offline and syncs on reconnect', async () => {
    const { ctrl, server, peek } = make();
    server.online = false;
    ctrl.setText('Written offline');
    await vi.advanceTimersByTimeAsync(1500);
    expect(ctrl.getState().status).toBe('offline');
    expect(peek()).toMatchObject({ text: 'Written offline', baseRevision: 0 });

    ctrl.setText('Written offline, more');
    await vi.advanceTimersByTimeAsync(2000);
    expect(ctrl.getState().status).toBe('offline');

    server.online = true;
    ctrl.retry();
    await vi.advanceTimersByTimeAsync(0);
    expect(server.text).toBe('Written offline, more');
    expect(ctrl.getState().status).toBe('saved');
    expect(peek()).toBeUndefined();
  });

  it('stops on a conflict and lets the student keep their text', async () => {
    const { ctrl, server } = make();
    server.text = 'From the other tab';
    server.draftRevision = 1;
    ctrl.setText('From this tab');
    await vi.advanceTimersByTimeAsync(1500);
    expect(ctrl.getState()).toMatchObject({
      status: 'conflict',
      conflict: { text: 'From the other tab', draftRevision: 1 },
    });

    ctrl.setText('From this tab, edited');
    await vi.advanceTimersByTimeAsync(5000);
    expect(server.text).toBe('From the other tab'); // no saves while the dialog is open

    await ctrl.keepMine();
    expect(server.snapshots).toEqual(['From the other tab']);
    expect(server.text).toBe('From this tab, edited');
    expect(ctrl.getState()).toMatchObject({ status: 'saved', conflict: null });
  });

  it('or switch to the other version', async () => {
    const { ctrl, server } = make();
    server.text = 'Theirs';
    server.draftRevision = 4;
    ctrl.setText('Mine');
    await vi.advanceTimersByTimeAsync(1500);
    await ctrl.takeTheirs();
    expect(ctrl.getState()).toMatchObject({ text: 'Theirs', status: 'saved' });
    expect(ctrl.draftRevision).toBe(4);
  });

  it('recovers text left on the device by an earlier visit', async () => {
    const { ctrl, server } = make(
      fakeServer('Old', 2),
      memoryStore({ text: 'Old and new', baseRevision: 2, updatedAt: 1 }),
    );
    await ctrl.recover();
    expect(server.text).toBe('Old and new');
    expect(ctrl.getState().status).toBe('saved');
  });

  it('treats leftover text on an older revision as a conflict', async () => {
    const { ctrl } = make(
      fakeServer('Changed elsewhere', 5),
      memoryStore({ text: 'Offline edit', baseRevision: 3, updatedAt: 1 }),
    );
    await ctrl.recover();
    expect(ctrl.getState()).toMatchObject({
      text: 'Offline edit',
      status: 'conflict',
      conflict: { text: 'Changed elsewhere', draftRevision: 5 },
    });
  });

  it('ensureSaved flushes and returns the revision to act on', async () => {
    const { ctrl } = make();
    ctrl.setText('Ready');
    await expect(ctrl.ensureSaved()).resolves.toBe(1);
  });
});
