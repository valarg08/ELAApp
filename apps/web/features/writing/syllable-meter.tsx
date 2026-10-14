'use client';

import { SubmissionDetail } from '@storyforge/shared';
import { checkSyllablePattern, syllableCount, syllableKey } from '@storyforge/writing-analysis';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

const COUNTS = [1, 2, 3, 4, 5, 6] as const;

/**
 * The haiku syllable counter (DESIGN.md §10, Unit 7): a live count for every line, green when it
 * matches the pattern. Each word shows its count; counts are estimates, so a "?" marks words worth
 * checking, and tapping any word lets the student set its syllables (saved with the submission).
 */
export function SyllableMeter({
  submissionId,
  text,
  pattern,
  overrides,
  onOverridesChange,
}: {
  submissionId: string;
  text: string;
  pattern: readonly number[];
  overrides: Record<string, number>;
  onOverridesChange: (overrides: Record<string, number>) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const check = checkSyllablePattern(text, pattern, overrides);

  async function setCount(word: string, count: number | null) {
    const previous = overrides;
    const next = { ...overrides };
    if (count === null || count === syllableCount(word)) delete next[word];
    else next[word] = count;
    onOverridesChange(next);
    setEditing(null);
    setError(null);
    try {
      const saved = await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/syllables`,
        SubmissionDetail,
        'PUT',
        { overrides: next },
      );
      onOverridesChange(saved.syllables);
    } catch (e) {
      onOverridesChange(previous);
      setError(e instanceof ApiError ? e.userMessage : 'Could not save that count. Try again.');
    }
  }

  return (
    <section
      aria-labelledby="syllable-title"
      className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4"
    >
      <h2 id="syllable-title" className="font-semibold">
        <span aria-hidden="true">👏 </span>Syllable counter ({pattern.join('-')})
      </h2>
      <p className="text-sm text-muted">
        Counts update as you type. Tap a word to change its count if Quill got it wrong (words with
        ? are worth checking). Leave a blank line between verses.
      </p>
      {check.stanzas.length === 0 && <p className="text-sm">Start typing your first line.</p>}
      <div className="flex flex-col gap-4" aria-live="polite">
        {check.stanzas.map((stanza, s) => (
          <ol
            key={stanza.lines[0]?.line.start ?? s}
            aria-label={`Verse ${s + 1}`}
            className="flex flex-col gap-1.5"
          >
            {stanza.lines.map((l, i) => {
              const want = pattern[i];
              const ok = want !== undefined && l.total === want;
              return (
                <li
                  key={l.line.start}
                  className={`flex flex-wrap items-center gap-1.5 rounded-lg border px-2 py-1.5 ${
                    want === undefined ? 'border-warn' : ok ? 'border-ok bg-ok/5' : 'border-border'
                  }`}
                >
                  <span
                    className={`min-w-16 text-sm font-semibold ${ok ? 'text-ok' : want === undefined ? 'text-warn' : ''}`}
                  >
                    {l.total}
                    {want === undefined ? ' (extra line)' : ` / ${want}`}
                    {ok && ' ✓'}
                  </span>
                  {l.words.map((w) => {
                    const key = syllableKey(w.word.text);
                    const id = `${l.line.start}-${w.word.start}`;
                    return (
                      <div key={id} className="relative">
                        <button
                          type="button"
                          aria-expanded={editing === id}
                          aria-label={`${w.word.text}: ${w.count} ${w.count === 1 ? 'syllable' : 'syllables'}${w.uncertain ? ', worth checking' : ''}. Change`}
                          onClick={() => setEditing(editing === id ? null : id)}
                          className="rounded-md border border-border bg-card px-1.5 py-0.5 text-sm hover:bg-border focus-visible:outline-3 focus-visible:outline-brand"
                        >
                          {w.word.text}{' '}
                          <sup className={overrides[key] ? 'font-bold text-brand' : 'text-muted'}>
                            {w.count}
                            {w.uncertain && '?'}
                          </sup>
                        </button>
                        {editing === id && (
                          <fieldset className="absolute top-full left-0 z-10 mt-1 flex gap-1 rounded-lg border border-border bg-card p-1 shadow">
                            <legend className="sr-only">Syllables in {w.word.text}</legend>
                            {COUNTS.map((n) => (
                              <button
                                key={n}
                                type="button"
                                aria-pressed={w.count === n}
                                onClick={() => void setCount(key, n)}
                                className={`size-8 rounded-md border text-sm focus-visible:outline-3 focus-visible:outline-brand ${
                                  w.count === n
                                    ? 'border-brand bg-brand text-white'
                                    : 'border-border'
                                }`}
                              >
                                {n}
                              </button>
                            ))}
                            {overrides[key] !== undefined && (
                              <button
                                type="button"
                                onClick={() => void setCount(key, null)}
                                className="rounded-md border border-border px-2 text-sm focus-visible:outline-3 focus-visible:outline-brand"
                              >
                                Reset
                              </button>
                            )}
                          </fieldset>
                        )}
                      </div>
                    );
                  })}
                </li>
              );
            })}
            {stanza.lines.length < pattern.length && (
              <li className="text-sm text-muted">
                {pattern.length - stanza.lines.length} more{' '}
                {pattern.length - stanza.lines.length === 1 ? 'line' : 'lines'} in this verse
              </li>
            )}
          </ol>
        ))}
      </div>
      <ErrorMessage message={error} />
    </section>
  );
}
