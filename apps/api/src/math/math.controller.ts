import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  AddErrorLogRequest,
  type ErrorLogEntry,
  type ErrorLogList,
  type ProblemSetAttemptView,
  type ProblemSetResult,
  type ProblemSetStatus,
  RedoRequest,
  type RedoResponse,
  SubmitProblemSetRequest,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { ErrorLogService } from './error-log.service.js';
import { ProblemSetService } from './problem-set.service.js';

/** Math track (DESIGN.md §9.13): marked problem sets and the error log. */
@Controller()
export class MathController {
  constructor(
    private readonly sets: ProblemSetService,
    private readonly errorLog: ErrorLogService,
  ) {}

  @Get('lessons/:lessonId/problem-sets/:key')
  status(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Param('key') key: string,
  ): Promise<ProblemSetStatus> {
    return this.sets.status(user, lessonId, key);
  }

  /** Start a try (or get back the unfinished one). */
  @Roles('STUDENT')
  @Post('lessons/:lessonId/problem-sets/:key/attempts')
  @HttpCode(200)
  start(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Param('key') key: string,
  ): Promise<ProblemSetAttemptView> {
    return this.sets.start(user, lessonId, key);
  }

  @Roles('STUDENT')
  @Post('lessons/:lessonId/problem-sets/:key/attempts/:attemptId/submit')
  @HttpCode(200)
  submit(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Param('key') key: string,
    @Param('attemptId') attemptId: string,
    @Body({ schema: SubmitProblemSetRequest }) body: SubmitProblemSetRequest,
  ): Promise<ProblemSetResult> {
    return this.sets.submit(user, lessonId, key, attemptId, body);
  }

  @Roles('STUDENT')
  @Get('math/error-log')
  errorLogList(@CurrentUser() user: AuthUser): Promise<ErrorLogList> {
    return this.errorLog.list(user);
  }

  @Roles('STUDENT')
  @Post('math/error-log')
  @HttpCode(200)
  addToErrorLog(
    @CurrentUser() user: AuthUser,
    @Body({ schema: AddErrorLogRequest }) body: AddErrorLogRequest,
  ): Promise<ErrorLogEntry> {
    return this.errorLog.add(user, body);
  }

  @Roles('STUDENT')
  @Post('math/error-log/:id/redo')
  @HttpCode(200)
  redo(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: RedoRequest }) body: RedoRequest,
  ): Promise<RedoResponse> {
    return this.errorLog.redo(user, id, body);
  }
}
