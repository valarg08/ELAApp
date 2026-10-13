import { Module } from '@nestjs/common';
import { CurriculumModule } from '../curriculum/curriculum.module.js';
import { FeedbackModule } from '../feedback/feedback.module.js';
import { SubmissionsController } from './submissions.controller.js';
import { SubmissionsService } from './submissions.service.js';
import { WordBankController } from './word-bank.controller.js';
import { WordBankService } from './word-bank.service.js';

@Module({
  imports: [CurriculumModule, FeedbackModule],
  controllers: [SubmissionsController, WordBankController],
  providers: [SubmissionsService, WordBankService],
})
export class WritingModule {}
