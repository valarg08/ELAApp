'use client';

import { SensoryWordText, WordBankResponse, type WordBankEntry } from '@storyforge/shared';
import { SENSES, type Sense } from '@storyforge/writing-analysis';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { SENSE_ICONS } from './sense-icons';

/**
 * The personal sensory word bank (DESIGN.md §10, Unit 6) beside the editor in every workspace.
 * Tap a word to put it at the cursor. Hidden until the student has words, except in sensory
 * activities, where it starts open so they can add their own.
 */
export function WordBankPanel({
  open: startOpen,
  words,
  onWordsChange: setWords,
  onInsert,
}: {
  open: boolean;
  /** The bank (null while loading). */
  words: WordBankEntry[] | null;
  onWordsChange: (words: WordBankEntry[]) => void;
  onInsert: (word: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [sense, setSense] = useState<Sense>('sight');
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);

  if (words === null || (words.length === 0 && !startOpen)) return null;

  async function add() {
    const parsed = SensoryWordText.safeParse(draft);
    if (!parsed.success) {
      setError('Use one to three words, letters only.');
      return;
    }
    try {
      const r = await apiJson('/word-bank', WordBankResponse, 'POST', {
        entries: [{ sense, word: parsed.data }],
      });
      setWords(r.words);
      setDraft('');
      setError(r.skipped > 0 ? 'That word can’t go in your word bank. Try another.' : null);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save the word. Try again.');
    }
  }

  async function remove(entry: WordBankEntry) {
    try {
      const r = await apiJson(
        `/word-bank/${encodeURIComponent(entry.id)}`,
        WordBankResponse,
        'DELETE',
      );
      setWords(r.words);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not remove the word. Try again.');
    }
  }

  return (
    <details className="rounded-xl border border-border bg-background p-4" open={startOpen}>
      <summary className="cursor-pointer font-semibold">
        <span aria-hidden="true">📚 </span>My sense words ({words.length})
      </summary>
      <p className="mt-2 text-sm text-muted">
        {editing ? 'Tap ✕ to remove a word.' : 'Tap a word to add it where your cursor is.'}
      </p>
      {words.length === 0 && (
        <p className="mt-2 text-sm">
          No words yet. Collect some in the sensory lab, or add one below.
        </p>
      )}
      <dl className="mt-2 flex flex-col gap-2">
        {SENSES.filter((s) => words.some((w) => w.sense === s)).map((s) => (
          <div key={s} className="flex flex-wrap items-center gap-1.5">
            <dt className="w-20 text-sm font-semibold">
              <span aria-hidden="true">{SENSE_ICONS[s]} </span>
              {s}
            </dt>
            {words
              .filter((w) => w.sense === s)
              .map((w) => (
                <dd key={w.id}>
                  <button
                    type="button"
                    onClick={() => (editing ? void remove(w) : onInsert(w.word))}
                    aria-label={editing ? `Remove ${w.word}` : `Add ${w.word} to your writing`}
                    className="rounded-full border border-border bg-card px-2.5 py-0.5 text-sm hover:bg-border focus-visible:outline-3 focus-visible:outline-brand"
                  >
                    {w.word}
                    {editing && <span aria-hidden="true"> ✕</span>}
                  </button>
                </dd>
              ))}
          </div>
        ))}
      </dl>
      <form
        className="mt-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void add();
        }}
      >
        <label className="flex flex-col gap-1 text-sm">
          Sense
          <select
            value={sense}
            onChange={(e) => setSense(SENSES.find((s) => s === e.target.value) ?? 'sight')}
            className="rounded-lg border border-border bg-card px-2 py-1.5"
          >
            {SENSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-32 flex-1 flex-col gap-1 text-sm">
          New word
          <input
            value={draft}
            maxLength={30}
            autoComplete="off"
            onChange={(e) => setDraft(e.target.value)}
            className="rounded-lg border border-border bg-card px-2 py-1.5"
          />
        </label>
        <Button type="submit" variant="secondary" disabled={draft.trim() === ''}>
          Add word
        </Button>
        {words.length > 0 && (
          <Button variant="secondary" onClick={() => setEditing((x) => !x)} aria-pressed={editing}>
            {editing ? 'Done' : 'Edit'}
          </Button>
        )}
      </form>
      <ErrorMessage message={error} />
    </details>
  );
}
