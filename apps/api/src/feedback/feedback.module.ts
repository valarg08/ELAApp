import { Module } from '@nestjs/common';
import { SafetyModule } from '../safety/safety.module.js';
import { FeedbackPipeline } from './feedback.pipeline.js';
import { FeedbackService } from './feedback.service.js';
import { FeedbackWorker } from './feedback.worker.js';
import { TeacherFeedbackController } from './teacher-feedback.controller.js';

@Module({
  imports: [SafetyModule],
  controllers: [TeacherFeedbackController],
  providers: [FeedbackService, FeedbackPipeline, FeedbackWorker],
  exports: [FeedbackService],
})
export class FeedbackModule {}
