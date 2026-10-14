'use client';

import { lineBreaks } from '@storyforge/writing-analysis';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui';

const PAUSE_MS = 700;

/** Say the words aloud; resolves when speech ends (or fails). */
function speak(words: string): Promise<void> {
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(words);
    u.rate = 0.9;
    u.addEventListener('end', () => resolve());
    u.addEventListener('error', () => resolve());
    window.speechSynthesis.speak(u);
  });
}

/**
 * The free-verse line-break visualiser (DESIGN.md §10, Unit 7): the same words as a paragraph and
 * as the student's lines, a ruler of line lengths with run-on (↩) and stopped (■) endings, and
 * read-aloud with a pause at every line break, or straight through, to hear the difference.
 */
export function LineBreakView({ text }: { text: string }) {
  const id = useId();
  const [view, setView] = useState<'lines' | 'paragraph'>('lines');
  const [reading, setReading] = useState<'pauses' | 'straight' | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const cancelled = useRef(false);
  const lb = lineBreaks(text);
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const widest = Math.max(1, lb.longest);

  useEffect(
    () => () => {
      cancelled.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window)
        window.speechSynthesis.cancel();
    },
    [],
  );

  if (lb.lines.length === 0) return null;

  function stop() {
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setReading(null);
    setCurrent(null);
  }

  async function read(mode: 'pauses' | 'straight') {
    stop();
    cancelled.current = false;
    setReading(mode);
    if (mode === 'straight') {
      await speak(lb.lines.map((l) => l.text.trim()).join(' '));
    } else {
      for (const [i, line] of lb.lines.entries()) {
        if (cancelled.current) break;
        setCurrent(i);
        await speak(line.text.trim());
        await new Promise((r) => setTimeout(r, PAUSE_MS));
      }
    }
    if (!cancelled.current) {
      setReading(null);
      setCurrent(null);
    }
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4"
    >
      <h2 id={`${id}-title`} className="font-semibold">
        <span aria-hidden="true">📏 </span>Your line breaks
      </h2>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Show the poem</legend>
        {(['lines', 'paragraph'] as const).map((v) => (
          <div key={v}>
            <input
              id={`${id}-${v}`}
              type="radio"
              name={`${id}-view`}
              className="peer sr-only"
              checked={view === v}
              onChange={() => setView(v)}
            />
            <label
              htmlFor={`${id}-${v}`}
              className="inline-block cursor-pointer rounded-full border border-border bg-card px-3 py-1 text-sm peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-brand"
            >
              {v === 'lines' ? 'As your lines' : 'As a paragraph'}
            </label>
          </div>
        ))}
      </fieldset>
      {view === 'paragraph' ? (
        <p className="rounded-lg bg-card p-3 leading-relaxed">
          {lb.lines.map((l) => l.text.trim()).join(' ')}
        </p>
      ) : (
        <ol
          className="flex flex-col gap-1 rounded-lg bg-card p-3"
          aria-label="Lines with their length"
        >
          {lb.lines.map((l, i) => (
            <li
              key={l.start}
              className={`grid grid-cols-[1fr_auto] items-center gap-3 rounded px-1 ${current === i ? 'bg-brand/15' : ''}`}
            >
              <span className="leading-relaxed">{l.text.trim()}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <span
                  aria-hidden="true"
                  className="h-2 rounded bg-brand/60"
                  style={{ width: `${Math.max(6, (l.words / widest) * 64)}px` }}
                />
                <span>
                  {l.words} {l.words === 1 ? 'word' : 'words'}
                </span>
                {i < lb.lines.length - 1 && (
                  <span title={l.enjambed ? 'Runs on' : 'Stops'}>
                    <span aria-hidden="true">{l.enjambed ? '↩' : '■'}</span>
                    <span className="sr-only">{l.enjambed ? ', runs on' : ', stops'}</span>
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="text-sm text-muted">
        ↩ runs on into the next line (the reader keeps going) · ■ stops with punctuation (the reader
        rests).
      </p>
      {canSpeak && (
        <div className="flex flex-wrap gap-2">
          {reading ? (
            <Button variant="secondary" onClick={stop}>
              <span aria-hidden="true">⏹ </span>Stop
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => void read('pauses')}>
                <span aria-hidden="true">🔊 </span>Read with pauses
              </Button>
              <Button variant="secondary" onClick={() => void read('straight')}>
                <span aria-hidden="true">🔊 </span>Read straight through
              </Button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
