import { Inject, Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';
import { QueueService } from '../ai/queue.service.js';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';
import { DatabaseService } from '../database/database.service.js';
import { FeedbackPipeline } from './feedback.pipeline.js';

/**
 * Consumes the ai-feedback queue. Runs in the API process during development (AI_WORKER defaults
 * to on there) and as its own process in production (`node dist/worker.js`).
 */
@Injectable()
export class FeedbackWorker implements OnApplicationBootstrap {
  private readonly logger = new Logger(FeedbackWorker.name);

  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly queue: QueueService,
    private readonly pipeline: FeedbackPipeline,
    private readonly db: DatabaseService,
  ) {}

  private get enabled(): boolean {
    return this.env.AI_WORKER ? this.env.AI_WORKER === 'true' : this.env.NODE_ENV === 'development';
  }

  async onApplicationBootstrap(): Promise<void> {
    if (!this.enabled) return;
    await this.queue.workFeedback(async ({ feedbackId }, { retryCount, retryLimit }) => {
      try {
        await this.pipeline.run(feedbackId);
      } catch (error) {
        this.logger.warn(
          `Feedback ${feedbackId} attempt ${retryCount + 1} failed: ${error instanceof Error ? error.message.split('\n')[0] : 'error'}`,
        );
        if (retryCount >= retryLimit) {
          await this.db.client.feedback.updateMany({
            where: { id: feedbackId, status: 'QUEUED' },
            data: { status: 'FAILED' },
          });
        }
        throw error;
      }
    });
  }
}
