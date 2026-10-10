import { AUTOSAVE_DEBOUNCE_MS, AUTOSAVE_MAX_WAIT_MS } from '@storyforge/shared';

/**
 * Autosave engine for the writing workspace (DESIGN.md §2.4). Framework-free so it can be tested
 * with fake timers; `useAutosave` connects it to React.
 *
 * - Saves 1.5 s after typing stops, and at least every 10 s while typing continues.
 * - One request at a time; changes made during a save are sent right after it.
 * - Unsaved text is kept on the device (IndexedDB) until the server confirms it, so going offline,
 *   closing the tab or crashing never loses work. Offline saves retry on reconnect.
 * - A stale revision (another tab or device saved first) stops autosave and asks the student.
 */

export type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'offline' | 'conflict' | 'error';

export type SaveResult =
  | { ok: true; draftRevision: number; savedAt: string; snapshotCreated: boolean }
  | { ok: false; kind: 'conflict' | 'offline' | 'error'; message?: string };

export interface ServerDraft {
  text: string;
  draftRevision: number;
}

export interface DraftTransport {
  save(text: string, baseRevision: number): Promise<SaveResult>;
  /** The current server copy (used to show the other version in a conflict). */
  load(): Promise<ServerDraft | null>;
  /** Store the server copy at this revision as a version (best effort). */
  snapshot(baseRevision: number): Promise<void>;
}

export interface PendingDraft {
  text: string;
  /** The server revision this text was written on top of. */
  baseRevision: number;
  updatedAt: number;
}

export interface PendingStore {
  get(): Promise<PendingDraft | undefined>;
  put(draft: PendingDraft): Promise<void>;
  clear(): Promise<void>;
}

export interface AutosaveState {
  text: string;
  status: SaveStatus;
  savedAt: string | null;
  /** Set while the student must choose between their text and the server's. */
  conflict: ServerDraft | null;
  error: string | null;
}

const OFFLINE_RETRY_MS = 5000;
const PENDING_WRITE_MS = 250;

export class AutosaveController {
  private state: AutosaveState;
  private readonly listeners = new Set<() => void>();
  private revision: number;
  /** Last text the server confirmed. */
  private savedText: string;
  private inFlight: Promise<boolean> | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | undefined;
  private pendingTimer: ReturnType<typeof setTimeout> | undefined;
  private firstUnsavedAt: number | null = null;
  private onSnapshot: () => void = () => {};

  constructor(
    initial: ServerDraft & { savedAt: string | null },
    private readonly transport: DraftTransport,
    private readonly pending: PendingStore,
  ) {
    this.revision = initial.draftRevision;
    this.savedText = initial.text;
    this.state = {
      text: initial.text,
      status: 'saved',
      savedAt: initial.savedAt,
      conflict: null,
      error: null,
    };
  }

  // ───────── external store API (useSyncExternalStore) ─────────

  getState = (): AutosaveState => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** Called when a save also stored a version (so the history can refresh). */
  setSnapshotListener(listener: () => void): void {
    this.onSnapshot = listener;
  }

  get draftRevision(): number {
    return this.revision;
  }

  /**
   * Pick up text left on this device by an earlier visit that never reached the server. If the
   * server moved on since, that's a conflict for the student to resolve.
   */
  async recover(): Promise<void> {
    const left = await this.pending.get();
    if (!left || left.text === this.savedText) {
      if (left) await this.pending.clear();
      return;
    }
    if (left.baseRevision === this.revision) {
      this.setText(left.text);
      await this.flush();
    } else {
      this.set({
        text: left.text,
        status: 'conflict',
        conflict: { text: this.savedText, draftRevision: this.revision },
      });
    }
  }

  setText(text: string): void {
    if (text === this.state.text) return;
    this.firstUnsavedAt ??= Date.now();
    const blocked = this.state.status === 'conflict';
    this.set({
      text,
      status: blocked ? 'conflict' : this.state.status === 'offline' ? 'offline' : 'unsaved',
    });
    this.keepOnDevice();
    if (!blocked) this.schedule();
  }

  /** Save now. Resolves true when the server has exactly the current text. */
  async flush(): Promise<boolean> {
    clearTimeout(this.saveTimer);
    if (this.inFlight) {
      await this.inFlight;
      return this.state.text === this.savedText || this.flush();
    }
    if (this.state.status === 'conflict') return false;
    if (this.state.text === this.savedText) {
      this.firstUnsavedAt = null;
      if (this.state.status !== 'saved') this.set({ status: 'saved', error: null });
      return true;
    }
    this.inFlight = this.send().finally(() => {
      this.inFlight = null;
    });
    return this.inFlight;
  }

  /** Make sure everything is saved; returns the revision to act on, or null if it couldn't. */
  async ensureSaved(): Promise<number | null> {
    return (await this.flush()) ? this.revision : null;
  }

  /** Conflict: overwrite the other version with this one (it stays in the version history). */
  async keepMine(): Promise<void> {
    const other = this.state.conflict ?? (await this.transport.load());
    if (!other) return;
    if (other.text.trim()) await this.transport.snapshot(other.draftRevision);
    this.revision = other.draftRevision;
    this.savedText = other.text;
    this.set({ conflict: null, status: 'unsaved', error: null });
    await this.flush();
  }

  /** Conflict: drop this text and continue from the other version. */
  async takeTheirs(): Promise<void> {
    const other = this.state.conflict ?? (await this.transport.load());
    if (!other) return;
    this.replace({ ...other, savedAt: this.state.savedAt });
  }

  /** Take a new server copy (after a restore, or choosing the other version). */
  replace(draft: ServerDraft & { savedAt: string | null }): void {
    clearTimeout(this.saveTimer);
    this.revision = draft.draftRevision;
    this.savedText = draft.text;
    this.firstUnsavedAt = null;
    this.set({
      text: draft.text,
      status: 'saved',
      savedAt: draft.savedAt,
      conflict: null,
      error: null,
    });
    void this.pending.clear();
  }

  /** Back online: send what's waiting. */
  retry = (): void => {
    if (this.state.status === 'offline' || this.state.status === 'error') void this.flush();
  };

  /** Send anything unsaved right away and stop the timers (the workspace is closing). */
  stop(): void {
    clearTimeout(this.saveTimer);
    clearTimeout(this.pendingTimer);
    if (this.state.text !== this.savedText) {
      void this.pending.put({
        text: this.state.text,
        baseRevision: this.revision,
        updatedAt: Date.now(),
      });
      if (this.state.status !== 'conflict') void this.flush();
    }
  }

  // ───────── internals ─────────

  private async send(): Promise<boolean> {
    const text = this.state.text;
    if (this.state.status !== 'offline') this.set({ status: 'saving' });
    const result = await this.transport.save(text, this.revision);

    if (result.ok) {
      this.revision = result.draftRevision;
      this.savedText = text;
      if (result.snapshotCreated) this.onSnapshot();
      if (this.state.text === text) {
        this.firstUnsavedAt = null;
        this.set({ status: 'saved', savedAt: result.savedAt, error: null });
        clearTimeout(this.pendingTimer);
        await this.pending.clear();
        return true;
      }
      // More typing happened while saving.
      this.set({ status: 'unsaved', savedAt: result.savedAt, error: null });
      this.schedule();
      return false;
    }

    this.keepOnDevice(0);
    if (result.kind === 'conflict') {
      const other = await this.transport.load();
      this.set({
        status: 'conflict',
        conflict: other ?? { text: '', draftRevision: this.revision + 1 },
      });
    } else if (result.kind === 'offline') {
      this.set({ status: 'offline' });
      this.saveTimer = setTimeout(() => void this.flush(), OFFLINE_RETRY_MS);
    } else {
      this.set({ status: 'error', error: result.message ?? 'Could not save.' });
    }
    return false;
  }

  private schedule(): void {
    clearTimeout(this.saveTimer);
    const waited = Date.now() - (this.firstUnsavedAt ?? Date.now());
    const delay = Math.max(0, Math.min(AUTOSAVE_DEBOUNCE_MS, AUTOSAVE_MAX_WAIT_MS - waited));
    this.saveTimer = setTimeout(() => void this.flush(), delay);
  }

  /** Write the current text to the device soon (or now), in case the save never arrives. */
  private keepOnDevice(delay = PENDING_WRITE_MS): void {
    clearTimeout(this.pendingTimer);
    this.pendingTimer = setTimeout(() => {
      if (this.state.text === this.savedText) return;
      void this.pending.put({
        text: this.state.text,
        baseRevision: this.revision,
        updatedAt: Date.now(),
      });
    }, delay);
  }

  private set(patch: Partial<AutosaveState>): void {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
  }
}
