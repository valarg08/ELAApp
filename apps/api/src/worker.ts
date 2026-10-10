import { Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AiModule } from './ai/ai.module.js';
import { ConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { FeedbackModule } from './feedback/feedback.module.js';

/**
 * Feedback worker process (production): `node dist/worker.js`. Run it next to the API with
 * `AI_WORKER=false` on the API. In development the API runs the worker itself.
 */
@Module({ imports: [ConfigModule, DatabaseModule, AiModule, FeedbackModule] })
class WorkerModule {}

process.env.AI_WORKER = 'true';
const app = await NestFactory.createApplicationContext(WorkerModule);
app.enableShutdownHooks();
Logger.log('Feedback worker started', 'Worker');
