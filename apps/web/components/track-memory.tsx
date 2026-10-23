'use client';

import type { Track } from '@storyforge/shared';
import { useEffect } from 'react';
import { LAST_TRACK_COOKIE } from '@/lib/last-track';

/** Remembers the track a student last opened, so /start can take them back to it. */
export function TrackMemory({ track }: { track: Track }) {
  useEffect(() => {
    document.cookie = `${LAST_TRACK_COOKIE}=${track}; path=/; max-age=31536000; samesite=lax`;
  }, [track]);
  return null;
}
