import { SNAPSHOT_INTERVAL_MS, SNAPSHOT_WORD_DELTA, changedWordCount } from '@storyforge/shared';

/**
 * Whether an autosave should also store a version (DESIGN.md §2.4): the first save, then whenever
 * 2 minutes have passed since the last snapshot or at least 50 words changed. Unchanged text never
 * makes a new snapshot.
 */
export function shouldSnapshot(
  last: { contentText: string; createdAt: Date } | null,
  text: string,
  now: Date,
): boolean {
  if (!last) return text.trim().length > 0;
  if (last.contentText === text) return false;
  return (
    now.getTime() - last.createdAt.getTime() >= SNAPSHOT_INTERVAL_MS ||
    changedWordCount(last.contentText, text) >= SNAPSHOT_WORD_DELTA
  );
}
