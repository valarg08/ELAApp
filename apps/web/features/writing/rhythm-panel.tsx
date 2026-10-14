'use client';

import { poemLines, splitSyllables, words } from '@storyforge/writing-analysis';
import { useEffect, useId, useRef, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';

const MIN_BPM = 60;
const MAX_BPM = 100;

/**
 * Spoken-word rhythm mode (DESIGN.md §10, Unit 7): a metronome (60–100 bpm), the poem split into
 * syllables to tap the stressed ones, and a practice recording. Stress marks are remembered in this
 * browser only; the recording never leaves the device (saving it would need teacher permission).
 */
export function RhythmPanel({ submissionId, text }: { submissionId: string; text: string }) {
  const id = useId();
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-4 rounded-xl border border-brand/40 bg-background p-4"
    >
      <h2 id={`${id}-title`} className="font-semibold">
        <span aria-hidden="true">🥁 </span>Rhythm mode
      </h2>
      <Metronome />
      <StressMarks submissionId={submissionId} text={text} />
      <Recorder />
    </section>
  );
}

function Metronome() {
  const id = useId();
  const [bpm, setBpm] = useState(80);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!running) return undefined;
    const ctx = audio.current ?? new AudioContext();
    audio.current = ctx;
    let n = 0;
    const tick = () => {
      // A short click, a little higher on the first beat of four.
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = n % 4 === 0 ? 1200 : 800;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      setBeat(n % 4);
      n += 1;
    };
    tick();
    const timer = setInterval(tick, 60_000 / bpm);
    return () => clearInterval(timer);
  }, [running, bpm]);

  useEffect(() => () => void audio.current?.close(), []);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">Beat</h3>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => setRunning((r) => !r)} aria-pressed={running}>
          {running ? '⏸ Stop the beat' : '▶ Start the beat'}
        </Button>
        <label htmlFor={`${id}-bpm`} className="text-sm">
          Speed: {bpm} beats a minute
        </label>
        <input
          id={`${id}-bpm`}
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          step={5}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-40 accent-brand"
        />
        <span aria-hidden="true" className="flex gap-1">
          {[0, 1, 2, 3].map((b) => (
            <span
              key={b}
              className={`size-3 rounded-full ${running && beat === b ? 'bg-brand' : 'bg-border'}`}
            />
          ))}
        </span>
      </div>
      <p className="text-sm text-muted">
        Read your poem aloud to the beat. Where do the strong syllables land?
      </p>
    </div>
  );
}

function StressMarks({ submissionId, text }: { submissionId: string; text: string }) {
  const storageKey = `storyforge:stress:${submissionId}`;
  const [marked, setMarked] = useState<Set<string>>(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []);
    } catch {
      return new Set();
    }
  });
  const lines = poemLines(text);

  function toggle(key: string) {
    const next = new Set(marked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setMarked(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([...next]));
    } catch {
      // Private windows can block storage; the marks still work for now.
    }
  }

  if (lines.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">Mark the stresses</h3>
      <p className="text-sm text-muted">
        Tap the syllables you say strongest (like <strong>THUN</strong>-der). They stay marked on
        this device.
      </p>
      <ol className="flex flex-col gap-1.5">
        {lines.map((line) => (
          <li key={line.start} className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {words(line.text).map((w, wi) => (
              <span key={w.start} className="inline-flex">
                {splitSyllables(w.text).map((syl, si) => {
                  const key = `${line.number}:${wi}:${si}`;
                  const on = marked.has(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      aria-label={`${syl}${on ? ', stressed' : ''} (in ${w.text})`}
                      onClick={() => toggle(key)}
                      className={`rounded px-0.5 focus-visible:outline-3 focus-visible:outline-brand ${
                        on ? 'bg-brand/15 font-bold text-brand uppercase' : 'hover:bg-border'
                      }`}
                    >
                      {syl}
                    </button>
                  );
                })}
              </span>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Recorder() {
  const [state, setState] = useState<'idle' | 'recording' | 'done'>('idle');
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const supported =
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia;

  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setUrl(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })));
        setState('done');
      };
      recorder.current = rec;
      rec.start();
      setState('recording');
    } catch {
      setError(
        'StoryForge can’t use the microphone. Check your browser’s permission, or skip this part.',
      );
    }
  }

  function discard() {
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setState('idle');
  }

  if (!supported) return null;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">Practise your performance</h3>
      <p className="text-sm text-muted">
        Record yourself and listen back. Your recording stays on this device: it is never uploaded
        or saved.
      </p>
      <div className="flex flex-wrap items-center gap-2" aria-live="polite">
        {state === 'idle' && (
          <Button variant="secondary" onClick={() => void start()}>
            <span aria-hidden="true">🎙 </span>Record
          </Button>
        )}
        {state === 'recording' && (
          <>
            <span className="text-sm font-semibold text-warn">● Recording…</span>
            <Button variant="secondary" onClick={() => recorder.current?.stop()}>
              Stop
            </Button>
          </>
        )}
        {state === 'done' && url && (
          <>
            {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- the student's own voice, played back to them */}
            <audio controls src={url} className="max-w-full" />
            <Button variant="secondary" onClick={discard}>
              Delete and try again
            </Button>
          </>
        )}
      </div>
      <ErrorMessage message={error} />
    </div>
  );
}
