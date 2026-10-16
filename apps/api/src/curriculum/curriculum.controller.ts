import { Body, Controller, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import {
  type ClassUnitPacing,
  type LessonDetail,
  type LessonProgressView,
  type QuizAttemptView,
  type QuizResult,
  type QuizStatus,
  SubmitQuizRequest,
  Track,
  type TrackProgress,
  type UnitDetail,
  type UnitSummary,
  UpdatePacingRequest,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { CurriculumService } from './curriculum.service.js';
import { PacingService } from './pacing.service.js';
import { ProgressService } from './progress.service.js';
import { QuizService } from './quiz.service.js';

/** `?track=ESSAY` picks Essay Writing, `?track=MATH` Math; anything else is Story Writing. */
const trackOf = (value?: string): Track => Track.catch('STORY').parse(value?.toUpperCase());

@Controller()
export class CurriculumController {
  constructor(
    private readonly curriculum: CurriculumService,
    private readonly quizzes: QuizService,
    private readonly progress: ProgressService,
  ) {}

  @Get('units')
  units(
    @CurrentUser() user: AuthUser,
    @Query('classId') classId?: string,
    @Query('track') track?: string,
  ): Promise<UnitSummary[]> {
    return this.curriculum.listUnits(user, classId, trackOf(track));
  }

  /** The progress tracker for one track (students only). */
  @Roles('STUDENT')
  @Get('progress')
  trackProgress(
    @CurrentUser() user: AuthUser,
    @Query('track') track?: string,
  ): Promise<TrackProgress> {
    return this.progress.trackProgress(user, trackOf(track));
  }

  @Roles('STUDENT')
  @Get('lessons/:lessonId/quizzes/:key')
  quizStatus(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Param('key') key: string,
  ): Promise<QuizStatus> {
    return this.quizzes.status(user, lessonId, key);
  }

  /** Start a try (or get back the unfinished one). */
  @Roles('STUDENT')
  @Post('lessons/:lessonId/quizzes/:key/attempts')
  @HttpCode(200)
  startQuiz(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Param('key') key: string,
  ): Promise<QuizAttemptView> {
    return this.quizzes.start(user, lessonId, key);
  }

  @Roles('STUDENT')
  @Post('lessons/:lessonId/quizzes/:key/attempts/:attemptId/submit')
  @HttpCode(200)
  submitQuiz(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Param('key') key: string,
    @Param('attemptId') attemptId: string,
    @Body({ schema: SubmitQuizRequest }) body: SubmitQuizRequest,
  ): Promise<QuizResult> {
    return this.quizzes.submit(user, lessonId, key, attemptId, body);
  }

  /** Accepts the unit id or its slug (e.g. "foundations"). */
  @Get('units/:unit')
  unit(
    @CurrentUser() user: AuthUser,
    @Param('unit') unit: string,
    @Query('classId') classId?: string,
  ): Promise<UnitDetail> {
    return this.curriculum.getUnit(user, unit, classId);
  }

  @Get('lessons/:lessonId')
  lesson(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
  ): Promise<LessonDetail> {
    return this.curriculum.getLesson(user, lessonId);
  }

  /** Body depends on the step; validated in the service (see STEP_RESPONSE_SCHEMAS). */
  @Roles('STUDENT')
  @Post('lessons/:lessonId/steps/:stepId/complete')
  @HttpCode(200)
  complete(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Param('stepId') stepId: string,
    @Body() body: unknown,
  ): Promise<LessonProgressView> {
    return this.curriculum.completeStep(user, lessonId, stepId, body);
  }
}

@Roles('TEACHER')
@Controller('teacher/classes/:classId/units')
export class PacingController {
  constructor(private readonly pacing: PacingService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
  ): Promise<ClassUnitPacing[]> {
    return this.pacing.list(user, classId);
  }

  @Put(':unitId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Param('unitId') unitId: string,
    @Body({ schema: UpdatePacingRequest }) body: UpdatePacingRequest,
  ): Promise<ClassUnitPacing> {
    return this.pacing.update(user, classId, unitId, body);
  }
}
