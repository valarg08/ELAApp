import { Module } from '@nestjs/common';
import { LiveChecksModule } from '../ai/live-checks.module.js';
import { ClassesModule } from '../classes/classes.module.js';
import { CurriculumModule } from '../curriculum/curriculum.module.js';
import { SafetyModule } from '../safety/safety.module.js';
import { AnswerLogService } from './answer-log.service.js';
import { ErrorLogService } from './error-log.service.js';
import { MasteryService } from './mastery.service.js';
import { MathContentService } from './math-content.service.js';
import { MathProgressService } from './math-progress.service.js';
import { MathTestsService } from './math-tests.service.js';
import { MathTutorService } from './math-tutor.service.js';
import { PastPaperService } from './past-paper.service.js';
import { MathController, MathTutorController } from './math.controller.js';
import { ProblemSetService } from './problem-set.service.js';

/**
 * The Math track (math-design.md): marked problem sets, the error log, the answer record and
 * mastery, timed tests, sprints and reviews, and Quill for Math.
 */
@Module({
  imports: [CurriculumModule, ClassesModule, LiveChecksModule, SafetyModule],
  controllers: [MathController, MathTutorController],
  providers: [
    MathContentService,
    AnswerLogService,
    MasteryService,
    ProblemSetService,
    ErrorLogService,
    MathTestsService,
    MathProgressService,
    MathTutorService,
    PastPaperService,
  ],
})
export class MathModule {}
