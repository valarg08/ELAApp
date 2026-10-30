import { Injectable } from '@nestjs/common';
import { type LoadedSatWeek, loadSatContent } from '../curriculum/content-loader.js';

/** How long loaded weeks are kept before the folder is read again. */
const KEEP_MS = 30_000;

/**
 * SAT Math's weekly tests (sat-design.md §4), read from content/sat on the server. They are not
 * copied to the database, so a student never receives a question before it is asked.
 */
@Injectable()
export class SatContentService {
  private cache: { at: number; weeks: LoadedSatWeek[] } | null = null;

  async weeks(): Promise<LoadedSatWeek[]> {
    if (this.cache && Date.now() - this.cache.at < KEEP_MS) return this.cache.weeks;
    const { weeks } = await loadSatContent();
    this.cache = { at: Date.now(), weeks };
    return weeks;
  }

  async week(week: number): Promise<LoadedSatWeek | undefined> {
    return (await this.weeks()).find((w) => w.week === week);
  }
}
