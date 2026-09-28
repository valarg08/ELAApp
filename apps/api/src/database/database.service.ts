import { Inject, Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import { createPrismaClient, type PrismaClient } from '@storyforge/db';
import type { DependencyStatus } from '@storyforge/shared';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';

const PING_TIMEOUT_MS = 2000;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  /** Null when DATABASE_URL is not set. Prisma connects lazily on first query. */
  readonly client: PrismaClient | null;

  constructor(@Inject(ENV) env: Env) {
    this.client = env.DATABASE_URL ? createPrismaClient(env.DATABASE_URL) : null;
  }

  private lastStatus: DependencyStatus | null = null;

  /** Check the database with `SELECT 1`, giving up after 2 seconds. */
  async ping(): Promise<DependencyStatus> {
    if (!this.client) return 'not_configured';
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Database ping timed out')), PING_TIMEOUT_MS);
    });
    try {
      await Promise.race([this.client.$queryRaw`SELECT 1`, timeout]);
      this.record('up');
      return 'up';
    } catch (error) {
      this.record('down', error);
      return 'down';
    } finally {
      clearTimeout(timer);
    }
  }

  /** Log only when the status changes, so health polling doesn't flood the log. */
  private record(status: DependencyStatus, error?: unknown): void {
    if (status === this.lastStatus) return;
    this.lastStatus = status;
    if (status === 'up') {
      this.logger.log('Database connection is up');
    } else {
      this.logger.warn(`Database unreachable: ${summarise(error)}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.$disconnect();
  }
}

/** Prisma errors span many lines; keep the most specific one (the last non-empty line). */
function summarise(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const lines = message.split('\n').map((line) => line.trim());
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null;
  const detail = lines.findLast((line) => line.length > 0) ?? 'unknown error';
  return typeof code === 'string' ? `${detail} (${code})` : detail;
}
