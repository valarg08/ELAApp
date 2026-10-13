'use client';

import { type LessonCard, POV_VERSION_LABELS } from '@storyforge/shared';
import { useId, useRef, useState } from 'react';

type Card = Extract<LessonCard, { kind: 'pov-simulator' }>;
type PovVersion = Card['versions'][number]['pov'];

/**
 * The POV simulator (DESIGN.md §10, Unit 5): one scene told 2–3 ways, switched with tabs (arrow keys
 * move between them). The camera picture shows where each narrator stands and whose thoughts it
 * can hear. Solved once every version has been read.
 */
export function PovSimulator({
  card,
  onSolved,
  frame,
}: {
  card: Card;
  onSolved: () => void;
  frame: string;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const version = card.versions[active];
  if (!version) return null;

  function select(i: number, focus = false) {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
    if (seen.has(i)) return;
    const next = new Set(seen).add(i);
    setSeen(next);
    if (next.size === card.versions.length) onSolved();
  }

  /** Arrow keys, Home and End move between tabs. */
  function onKeyDown(e: React.KeyboardEvent) {
    const n = card.versions.length;
    const to =
      e.key === 'ArrowRight'
        ? (active + 1) % n
        : e.key === 'ArrowLeft'
          ? (active - 1 + n) % n
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? n - 1
              : null;
    if (to === null) return;
    e.preventDefault();
    select(to, true);
  }

  return (
    <div className={frame}>
      <h2 className="text-2xl font-bold">{card.title}</h2>
      {card.prompt && <p className="mt-2 text-lg">{card.prompt}</p>}
      <div role="tablist" aria-label="Points of view" className="mt-4 flex flex-wrap gap-2">
        {card.versions.map((v, i) => (
          <button
            key={v.pov}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={onKeyDown}
            className={`rounded-full border px-4 py-1.5 font-semibold focus-visible:outline-3 focus-visible:outline-brand ${
              i === active
                ? 'border-brand bg-brand text-white'
                : 'border-border bg-background hover:bg-border'
            }`}
          >
            {POV_VERSION_LABELS[v.pov]}
            {seen.has(i) && i !== active && <span aria-hidden="true"> ✓</span>}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]"
      >
        <blockquote className="border-l-4 border-brand pl-4 text-xl leading-relaxed italic">
          {version.text}
        </blockquote>
        <CameraPicture pov={version.pov} />
        <p className="rounded-xl bg-background p-3 sm:col-span-2">
          <span aria-hidden="true">🎥 </span>
          <strong>The narrator knows: </strong>
          {version.knows}
        </p>
      </div>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {seen.size === card.versions.length
          ? '✓ You’ve seen every point of view.'
          : `Read all ${card.versions.length} versions (${seen.size} so far).`}
      </p>
    </div>
  );
}

const CAMERA_CAPTIONS: Record<PovVersion, string> = {
  first:
    'The camera is inside the narrator’s head: we see through their eyes and hear their thoughts.',
  'third-limited':
    'The camera follows one character, just over their shoulder: we hear only their thoughts.',
  omniscient: 'The camera floats above everyone: the narrator can hear every character’s thoughts.',
};

/** Two characters, the camera, and thought bubbles over the minds the narrator can hear. */
function CameraPicture({ pov }: { pov: PovVersion }) {
  const camera = { first: [62, 44], 'third-limited': [30, 34], omniscient: [100, 12] }[pov];
  const bothMinds = pov === 'omniscient';
  return (
    <figure className="mx-auto flex w-48 flex-col items-center gap-1">
      <svg viewBox="0 0 200 130" className="w-full text-foreground" aria-hidden="true">
        {/* Ground */}
        <line x1="10" y1="122" x2="190" y2="122" stroke="currentColor" strokeOpacity="0.3" />
        {/* Character A (the narrator or focus character) */}
        <g className="text-brand" stroke="currentColor" strokeWidth="3" fill="none">
          <circle cx="70" cy="62" r="10" fill="currentColor" fillOpacity="0.15" />
          <line x1="70" y1="72" x2="70" y2="100" />
          <line x1="70" y1="100" x2="60" y2="120" />
          <line x1="70" y1="100" x2="80" y2="120" />
          <line x1="70" y1="80" x2="56" y2="92" />
          <line x1="70" y1="80" x2="84" y2="92" />
        </g>
        {/* Character B */}
        <g stroke="currentColor" strokeOpacity="0.6" strokeWidth="3" fill="none">
          <circle cx="140" cy="62" r="10" />
          <line x1="140" y1="72" x2="140" y2="100" />
          <line x1="140" y1="100" x2="130" y2="120" />
          <line x1="140" y1="100" x2="150" y2="120" />
          <line x1="140" y1="80" x2="126" y2="92" />
          <line x1="140" y1="80" x2="154" y2="92" />
        </g>
        {/* Thought bubbles: the minds the narrator can hear */}
        <ThoughtBubble x={84} y={34} className="text-brand" />
        {bothMinds && <ThoughtBubble x={154} y={34} className="text-foreground" />}
        {!bothMinds && (
          <text x="154" y="40" fontSize="16" fill="currentColor" fillOpacity="0.5">
            ?
          </text>
        )}
        {/* The camera */}
        <g transform={`translate(${camera[0]} ${camera[1]})`} className="text-warn">
          <rect x="-11" y="-7" width="18" height="14" rx="3" fill="currentColor" />
          <path d="M7 -4 L13 -8 L13 8 L7 4 Z" fill="currentColor" />
        </g>
      </svg>
      <figcaption className="text-center text-xs text-muted">{CAMERA_CAPTIONS[pov]}</figcaption>
    </figure>
  );
}

function ThoughtBubble({ x, y, className }: { x: number; y: number; className: string }) {
  return (
    <g className={className} fill="currentColor" fillOpacity="0.2" stroke="currentColor">
      <ellipse cx={x} cy={y} rx="14" ry="9" />
      <circle cx={x - 8} cy={y + 13} r="3" />
      <text x={x - 6} y={y + 4} fontSize="10" stroke="none" fillOpacity="1">
        …
      </text>
    </g>
  );
}
