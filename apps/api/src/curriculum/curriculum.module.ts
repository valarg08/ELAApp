import { Module } from '@nestjs/common';
import { ClassesModule } from '../classes/classes.module.js';
import { CurriculumController, PacingController } from './curriculum.controller.js';
import { CurriculumService } from './curriculum.service.js';
import { PacingService } from './pacing.service.js';
import { ProgressService } from './progress.service.js';
import { QuizService } from './quiz.service.js';

@Module({
  imports: [ClassesModule],
  controllers: [CurriculumController, PacingController],
  providers: [CurriculumService, PacingService, QuizService, ProgressService],
  exports: [CurriculumService],
})
export class CurriculumModule {}
