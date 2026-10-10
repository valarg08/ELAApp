import { Module } from '@nestjs/common';
import { CurriculumModule } from '../curriculum/curriculum.module.js';
import { SubmissionsController } from './submissions.controller.js';
import { SubmissionsService } from './submissions.service.js';

@Module({
  imports: [CurriculumModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class WritingModule {}
