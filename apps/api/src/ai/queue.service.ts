import { Inject, Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import { FEEDBACK_QUEUE, type FeedbackJob } from '@storyforge/shared';
import { PgBoss } from 'pg-boss';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';

/** Retries with exponential backoff (DESIGN.md §2.6: ai-feedback, 3 retries). */
const FEEDBACK_QUEUE_OPTIONS = { retryLimit: 3, retryDelay: 30, retryBackoff: true } as const;

/**
 * Background jobs on PostgreSQL with pg-boss (no Redis). It keeps its tables in its own `pgboss`
 * schema, created on first start. Started lazily, so API processes that never enqueue (and the
 * API tests) don't connect.
 */
@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private boss: Promise<PgBoss> | null = null;

  constructor(@Inject(ENV) private readonly env: Env) {}

  private start(): Promise<PgBoss> {
    this.boss ??= (async () => {
      const boss = new PgBoss(this.env.DATABASE_URL);
      boss.on('error', (error) => this.logger.error(`pg-boss: ${error.message}`));
      await boss.start();
      if (!(await boss.getQueue(FEEDBACK_QUEUE))) {
        await boss.createQueue(FEEDBACK_QUEUE, FEEDBACK_QUEUE_OPTIONS);
      }
      return boss;
    })();
    return this.boss;
  }

  /** One job per feedback row; a repeat send for the same row is ignored. */
  async enqueueFeedback(job: FeedbackJob): Promise<void> {
    const boss = await this.start();
    await boss.send(FEEDBACK_QUEUE, job, {
      ...FEEDBACK_QUEUE_OPTIONS,
      singletonKey: job.feedbackId,
    });
  }

  /** Process feedback jobs one at a time (the worker). */
  async workFeedback(
    handler: (
      job: FeedbackJob,
      attempt: { retryCount: number; retryLimit: number },
    ) => Promise<void>,
  ): Promise<void> {
    const boss = await this.start();
    await boss.work<FeedbackJob>(FEEDBACK_QUEUE, { batchSize: 1 }, async (jobs) => {
      for (const job of jobs) {
        await handler(job.data, {
          retryCount: job.retryCount,
          retryLimit: FEEDBACK_QUEUE_OPTIONS.retryLimit,
        });
      }
    });
    this.logger.log(`Working on the "${FEEDBACK_QUEUE}" queue`);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.boss) await (await this.boss).stop({ graceful: true });
  }
}
