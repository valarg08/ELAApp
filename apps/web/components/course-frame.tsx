'use client';

import { type ReactNode, useState, useSyncExternalStore } from 'react';
import { navFocus, navPanel } from './course-styles';

const STORAGE_KEY = 'course-chapters-collapsed';

// The remembered choice lives in localStorage; these let React read it without a hydration mismatch.
const listeners = new Set<() => void>();
/** Used when storage is blocked (private windows), so the toggle still works for this visit. */
let inMemory = false;
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}
function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return inMemory;
  }
}
function writeCollapsed(value: boolean) {
  inMemory = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // Not remembered across visits; readCollapsed falls back to inMemory.
  }
  for (const l of listeners) l();
}

/**
 * The Chapters panel of the course frame, with the chapters rendered once: on phones a
 * "Chapters" button shows them above the page. With `collapsible` (the writing workspace), « folds
 * the panel to a slim rail on wider screens, remembered in this browser; CourseShell's grid narrows
 * the column when it sees `data-folded`.
 */
export function ChaptersPanel({
  collapsible,
  children,
}: {
  collapsible: boolean;
  children: ReactNode;
}) {
  // The server render (and the first client render) has the panel open.
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const folded = collapsible && collapsed;
  // Phones: the chapters start folded under the "Chapters" button.
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div data-folded={folded || undefined} className={`${navPanel} ${folded ? 'md:px-1.5' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="chapters-panel"
          className={`flex min-h-11 flex-1 items-center justify-between rounded-xl text-left font-semibold md:hidden ${navFocus}`}
        >
          Chapters
          <span aria-hidden="true">{mobileOpen ? '▴' : '▾'}</span>
        </button>
        <h2 className={`hidden text-lg font-semibold md:block ${folded ? 'md:sr-only' : ''}`}>
          Chapters
        </h2>
        {collapsible && (
          <button
            type="button"
            onClick={() => writeCollapsed(!collapsed)}
            aria-expanded={!folded}
            aria-controls="chapters-panel"
            className={`hidden min-h-11 min-w-11 items-center justify-center rounded-xl text-lg font-semibold hover:bg-white/10 md:inline-flex ${navFocus}`}
          >
            <span aria-hidden="true">{folded ? '»' : '«'}</span>
            <span className="sr-only">{folded ? 'Show chapters' : 'Hide chapters'}</span>
          </button>
        )}
      </div>
      <div
        id="chapters-panel"
        className={`mt-3 md:mt-2 ${mobileOpen ? '' : 'hidden'} ${folded ? 'md:hidden' : 'md:block'}`}
      >
        {children}
      </div>
    </div>
  );
}
