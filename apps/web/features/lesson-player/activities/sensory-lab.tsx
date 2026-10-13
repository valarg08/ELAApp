'use client';

import { type ActivityContent, SensoryWordText, WordBankResponse } from '@storyforge/shared';
import type { Sense } from '@storyforge/writing-analysis';
import { useId, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { SENSE_ICONS } from '@/features/writing/sense-icons';
import type { ActivityResult } from './types';

type Activity = Extract<ActivityContent, { type: 'SENSORY_LAB' }>;
type Station = Activity['stations'][number];

/**
 * The sensory lab (DESIGN.md §10, Unit 6): a station per sense with a scene to imagine (read aloud
 * on request) and a word jar. When every jar is full, the words go to the student's word bank.
 */
export function SensoryLab({
  activity,
  onDone,
}: {
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const [jars, setJars] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const need = activity.wordsPerStation;
  const station = activity.stations[active];
  const full = (s: Station) => (jars[s.sense]?.length ?? 0) >= need;
  const allFull = activity.stations.every(full);
  if (!station) return null;

  const setJar = (sense: Sense, words: string[]) => setJars((j) => ({ ...j, [sense]: words }));

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const entries = activity.stations.flatMap((s) =>
        (jars[s.sense] ?? []).map((word) => ({ sense: s.sense, word })),
      );
      const result = await apiJson('/word-bank', WordBankResponse, 'POST', { entries });
      const kept = entries.length - result.skipped;
      setSaved(
        `✓ ${kept} ${kept === 1 ? 'word' : 'words'} saved to your word bank. You’ll find them beside your writing.`,
      );
    } catch (e) {
      setError(
        e instanceof ApiError ? e.userMessage : 'Could not save your words. Check your connection.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg">{activity.instructions}</p>
      <ul className="flex flex-wrap gap-2" aria-label="Stations">
        {activity.stations.map((s, i) => (
          <li key={s.sense}>
            <button
              type="button"
              aria-pressed={i === active}
              aria-controls={`${id}-station`}
              onClick={() => setActive(i)}
              className={`rounded-full border px-3 py-1.5 font-semibold focus-visible:outline-3 focus-visible:outline-brand ${
                i === active
                  ? 'border-brand bg-brand text-white'
                  : full(s)
                    ? 'border-ok bg-background text-ok'
                    : 'border-border bg-background hover:bg-border'
              }`}
            >
              <span aria-hidden="true">{SENSE_ICONS[s.sense]} </span>
              {s.title}{' '}
              <span className="text-sm font-normal">
                {full(s) ? '✓' : `${jars[s.sense]?.length ?? 0}/${need}`}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <StationPanel
        key={station.sense}
        id={`${id}-station`}
        station={station}
        need={need}
        words={jars[station.sense] ?? []}
        onChange={(words) => setJar(station.sense, words)}
        onNext={active < activity.stations.length - 1 ? () => setActive(active + 1) : undefined}
      />

      <div aria-live="polite" className="flex flex-col gap-3">
        {!allFull && (
          <p className="text-sm text-muted">
            Fill every jar with at least {need} {need === 1 ? 'word' : 'words'} to finish the lab.
          </p>
        )}
        {allFull && !saved && (
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={saving} onClick={() => void save()}>
              {saving ? 'Saving…' : 'Save to my word bank'}
            </Button>
            {error && (
              <Button variant="secondary" onClick={() => onDone({ correct: true, attempts: 1 })}>
                Continue without saving
              </Button>
            )}
          </div>
        )}
        <ErrorMessage message={error} />
        {saved && (
          <>
            <p className="font-semibold text-ok">{saved}</p>
            <Button className="self-start" onClick={() => onDone({ correct: true, attempts: 1 })}>
              Next
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function StationPanel({
  id,
  station,
  need,
  words,
  onChange,
  onNext,
}: {
  id: string;
  station: Station;
  need: number;
  words: string[];
  onChange: (words: string[]) => void;
  onNext?: () => void;
}) {
  const [draft, setDraft] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const [showIdeas, setShowIdeas] = useState(false);
  const inputId = `${id}-input`;
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  function add(raw: string) {
    const parsed = SensoryWordText.safeParse(raw);
    if (!parsed.success) {
      setProblem('Use one to three words, letters only.');
      return;
    }
    setProblem(null);
    if (!words.includes(parsed.data)) onChange([...words, parsed.data]);
    setDraft('');
  }

  function readAloud() {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(station.scene));
  }

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <span aria-hidden="true" className="text-5xl leading-none">
          {station.picture}
        </span>
        <div className="flex flex-col gap-2">
          <h2 id={`${id}-title`} className="text-xl font-bold">
            {SENSE_ICONS[station.sense]} {station.title}
          </h2>
          <p className="text-lg leading-relaxed">{station.scene}</p>
          {canSpeak && (
            <Button variant="secondary" className="self-start" onClick={readAloud}>
              <span aria-hidden="true">🔊 </span>Read it aloud
            </Button>
          )}
        </div>
      </div>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add(draft);
        }}
      >
        <label htmlFor={inputId} className="font-medium">
          {station.prompt}
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id={inputId}
            value={draft}
            maxLength={30}
            autoComplete="off"
            onChange={(e) => setDraft(e.target.value)}
            aria-describedby={`${id}-jar-status`}
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
          />
          <Button type="submit" disabled={draft.trim() === ''}>
            Add to jar
          </Button>
        </div>
        {problem && <p className="text-sm text-warn">{problem}</p>}
      </form>
      <div className="rounded-xl border-2 border-dashed border-border bg-background p-3">
        <p id={`${id}-jar-status`} className="text-sm font-semibold" aria-live="polite">
          <span aria-hidden="true">🫙 </span>
          Your jar: {words.length} {words.length === 1 ? 'word' : 'words'}
          {words.length >= need ? ' ✓' : ` (${need - words.length} more)`}
        </p>
        {words.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {words.map((w) => (
              <li key={w}>
                <button
                  type="button"
                  onClick={() => onChange(words.filter((x) => x !== w))}
                  aria-label={`Remove ${w}`}
                  className="rounded-full border border-brand px-3 py-0.5 text-brand hover:bg-brand/10 focus-visible:outline-3 focus-visible:outline-brand"
                >
                  {w} <span aria-hidden="true">✕</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          aria-expanded={showIdeas}
          onClick={() => setShowIdeas((s) => !s)}
        >
          <span aria-hidden="true">💡 </span>
          {showIdeas ? 'Hide ideas' : 'Need ideas?'}
        </Button>
        {onNext && words.length >= need && <Button onClick={onNext}>Next station →</Button>}
      </div>
      {showIdeas && (
        <ul className="flex flex-wrap gap-2" aria-label="Idea words: tap one to add it">
          {station.ideas
            .filter((w) => !words.includes(w))
            .map((w) => (
              <li key={w}>
                <button
                  type="button"
                  onClick={() => add(w)}
                  className="rounded-full border border-border bg-background px-3 py-0.5 hover:bg-border focus-visible:outline-3 focus-visible:outline-brand"
                >
                  + {w}
                </button>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
