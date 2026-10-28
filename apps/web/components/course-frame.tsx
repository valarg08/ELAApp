'use client';

import { type ReactNode, useState, useSyncExternalStore } from 'react';
import { cyanFocus, cyanPanel, navFocus, navPanel } from './course-styles';

// The remembered choices live in localStorage; these let React read them without a hydration mismatch.
const listeners = new Set<() => void>();
/** Used when storage is blocked (private windows), so the toggles still work for this visit. */
const inMemory = new Map<string, boolean>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}
function readCollapsed(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return inMemory.get(key) ?? false;
  }
}
function writeCollapsed(key: string, value: boolean) {
  inMemory.set(key, value);
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    // Not remembered across visits; readCollapsed falls back to inMemory.
  }
  for (const l of listeners) l();
}

/**
 * A side panel of the course frame (light teal Chapters on the left, light cyan Progress on the right), with its
 * content rendered once. With `mobileFold` (Chapters) a button shows the content on phones. With
 * `collapsible` (the writing workspace) a button folds the panel to a slim rail on wider screens,
 * remembered in this browser; CourseShell's grid narrows the column when it sees `data-folded`.
 */
export function SidePanel({
  name,
  title,
  side,
  collapsible,
  mobileFold = false,
  tone = 'teal',
  children,
}: {
  /** `data-folded` value, element id and storage key part: "chapters" or "progress". */
  name: string;
  title: string;
  side: 'left' | 'right';
  collapsible: boolean;
  mobileFold?: boolean;
  /** Light teal (Chapters) or light cyan (Progress), both with deep teal text. */
  tone?: 'teal' | 'cyan';
  children: ReactNode;
}) {
  const key = `course-${name}-collapsed`;
  // The server render (and the first client render) has the panel open.
  const collapsed = useSyncExternalStore(
    subscribe,
    () => readCollapsed(key),
    () => false,
  );
  const folded = collapsible && collapsed;
  const [mobileOpen, setMobileOpen] = useState(false);
  const id = `${name}-panel`;
  const focus = tone === 'cyan' ? cyanFocus : navFocus;
  // The arrow points the way the panel moves: towards its edge to fold, away from it to open.
  const toEdge = side === 'left' ? '«' : '»';
  const fromEdge = side === 'left' ? '»' : '«';

  const foldButton = collapsible && (
    <button
      type="button"
      onClick={() => writeCollapsed(key, !collapsed)}
      aria-expanded={!folded}
      aria-controls={id}
      className={`hidden min-h-11 min-w-11 items-center justify-center rounded-xl text-lg font-semibold hover:bg-brand/10 md:inline-flex ${focus}`}
    >
      <span aria-hidden="true">{folded ? fromEdge : toEdge}</span>
      <span className="sr-only">
        {folded ? 'Show' : 'Hide'} {title.toLowerCase()}
      </span>
    </button>
  );

  return (
    <div
      data-folded={folded ? name : undefined}
      className={`${tone === 'cyan' ? cyanPanel : navPanel} ${folded ? 'md:px-1.5' : ''}`}
    >
      <div
        className={`flex items-center justify-between gap-2 ${collapsible && side === 'right' ? 'md:flex-row-reverse' : ''}`}
      >
        {mobileFold && (
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls={id}
            className={`flex min-h-11 flex-1 items-center justify-between rounded-xl text-left font-semibold md:hidden ${focus}`}
          >
            {title}
            <span aria-hidden="true">{mobileOpen ? '▴' : '▾'}</span>
          </button>
        )}
        <h2
          className={`text-lg font-semibold ${mobileFold ? 'hidden md:block' : ''} ${folded ? 'md:sr-only' : ''}`}
        >
          {title}
        </h2>
        {foldButton}
      </div>
      <div
        id={id}
        className={`mt-3 md:mt-2 ${mobileFold && !mobileOpen ? 'hidden' : ''} ${folded ? 'md:hidden' : 'md:block'}`}
      >
        {children}
      </div>
    </div>
  );
}
