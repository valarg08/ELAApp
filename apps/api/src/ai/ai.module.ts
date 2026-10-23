import { Global, Module } from '@nestjs/common';
import { createGateway } from '@storyforge/ai';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';
import { AI_GATEWAY, AiRunnerService } from './ai-runner.service.js';
import { QueueService } from './queue.service.js';

/** Claude gateway (or the offline fake), the cached runner and the job queue. */
@Global()
@Module({
  providers: [
    {
      provide: AI_GATEWAY,
      inject: [ENV],
      useFactory: (env: Env) =>
        createGateway({
          provider: env.AI_PROVIDER,
          apiKey: env.ANTHROPIC_API_KEY,
          workspaceId: env.ANTHROPIC_WORKSPACE_ID,
          model: env.AI_MODEL,
        }),
    },
    AiRunnerService,
    QueueService,
  ],
  exports: [AI_GATEWAY, AiRunnerService, QueueService],
})
export class AiModule {}
