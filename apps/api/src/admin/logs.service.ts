import { open, readdir } from 'node:fs/promises';
import path from 'node:path';
import { Inject, Injectable } from '@nestjs/common';
import type { AdminLogEntry, AdminLogs } from '@storyforge/shared';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';

const HOURS = 24;
/** Only the end of each file is read: enough for a day of a small site. */
const TAIL_BYTES = 4 * 1024 * 1024;
const MAX_ENTRIES = 2000;
const MAX_TEXT = 4000;
/** pm2's files for the production processes: owlery-api-out.log, owlery-web-error.log… */
const FILE = /^owlery-(api|worker|web|tunnel)-(out|error)\.log$/;

/** pm2's own prefix (log_date_format) or a line that starts with an ISO time (cloudflared). */
const ISO_PREFIX = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?):?\s/;
/** Nest's logger: "[Nest] 123  - 10/22/2026, 10:09:11 PM    WARN [Context] …". */
const NEST =
  /- (\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M)\s+(LOG|WARN|ERROR|DEBUG|VERBOSE|FATAL) /;
/** cloudflared's level, once its own time is stripped. */
const CLOUDFLARED = /^(INF|WRN|ERR|DBG) /;

type Level = AdminLogEntry['level'];

function levelOf(text: string, stream: string): Level {
  const nest = NEST.exec(text)?.[2];
  if (nest)
    return nest === 'ERROR' || nest === 'FATAL' ? 'error' : nest === 'WARN' ? 'warn' : 'info';
  const cf = CLOUDFLARED.exec(text)?.[1];
  if (cf) return cf === 'ERR' ? 'error' : cf === 'WRN' ? 'warn' : 'info';
  return stream === 'error' ? 'error' : 'info';
}

async function tail(file: string): Promise<string[]> {
  const handle = await open(file, 'r');
  try {
    const { size } = await handle.stat();
    const start = Math.max(0, size - TAIL_BYTES);
    const buffer = Buffer.alloc(size - start);
    await handle.read(buffer, 0, buffer.length, start);
    const lines = buffer.toString('utf8').split(/\r?\n/);
    if (start > 0) lines.shift(); // a partial first line
    return lines;
  } finally {
    await handle.close();
  }
}

/**
 * The admin Logs page (DESIGN.md §11.9): the last day of the pm2 log files, newest first. The logs
 * never hold student text (a CLAUDE.md rule), so they can be shown to the admin as they are.
 */
@Injectable()
export class LogsService {
  constructor(@Inject(ENV) private readonly env: Env) {}

  async recent(): Promise<AdminLogs> {
    const dir = this.env.LOG_DIR;
    if (!dir) return { available: false, hours: HOURS, entries: [], truncated: false };
    const since = Date.now() - HOURS * 3_600_000;
    const names = (await readdir(dir).catch(() => [] as string[])).filter((n) => FILE.test(n));

    const entries: AdminLogEntry[] = [];
    for (const name of names) {
      const [, source = '', stream = ''] = FILE.exec(name) ?? [];
      let last: AdminLogEntry | undefined;
      for (const raw of await tail(path.join(dir, name))) {
        if (!raw.trim()) continue;
        const iso = ISO_PREFIX.exec(raw);
        // cloudflared adds its own time after pm2's.
        const text = (iso ? raw.slice(iso[0].length) : raw).replace(ISO_PREFIX, '');
        const nest = NEST.exec(text)?.[1];
        const stamp = iso?.[1] ?? nest;
        const time = stamp ? new Date(stamp) : undefined;
        // Stack traces and other follow-on lines join the message before them.
        const continues = !nest && (/^\s|^[}\])]/.test(text) || !time);
        if (continues) {
          if (last && last.text.length < MAX_TEXT)
            last.text = `${last.text}\n${text}`.slice(0, MAX_TEXT);
          continue;
        }
        if (!time || Number.isNaN(time.getTime()) || time.getTime() < since) {
          last = undefined;
          continue;
        }
        last = {
          time: time.toISOString(),
          source,
          level: levelOf(text, stream),
          text: text.slice(0, MAX_TEXT),
        };
        entries.push(last);
      }
    }
    entries.sort((a, b) => b.time.localeCompare(a.time));
    return {
      available: true,
      hours: HOURS,
      entries: entries.slice(0, MAX_ENTRIES),
      truncated: entries.length > MAX_ENTRIES,
    };
  }
}
