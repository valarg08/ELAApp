import { Module } from '@nestjs/common';
import { CurriculumModule } from '../curriculum/curriculum.module.js';
import { ErrorLogService } from './error-log.service.js';
import { MathContentService } from './math-content.service.js';
import { MathController } from './math.controller.js';
import { ProblemSetService } from './problem-set.service.js';

/** The Math track (DESIGN.md §9.13): marked problem sets and the error log. */
@Module({
  imports: [CurriculumModule],
  controllers: [MathController],
  providers: [MathContentService, ProblemSetService, ErrorLogService],
})
export class MathModule {}
