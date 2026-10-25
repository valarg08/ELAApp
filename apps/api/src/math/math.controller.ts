import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import {
  AddErrorLogRequest,
  type ClassMathSkills,
  CreatePastPaperRequest,
  type ErrorLogEntry,
  type ErrorLogList,
  ErrorCode,
  type FactSheetView,
  MathCardRequest,
  type MathCardResponse,
  MathExplainRequest,
  type MathExplainResponse,
  type MathHome,
  MathNudgeRequest,
  type MathNudgeResponse,
  type MathSkillsView,
  MathStartKey,
  type MathTestView,
  type PastPaperList,
  type PastPaperView,
  PracticeAnswersRequest,
  type PracticeAnswersResponse,
  type ProblemSetAttemptView,
  type ProblemSetResult,
  type ProblemSetStatus,
  RedoRequest,
  type RedoResponse,
  SaveTestAnswerRequest,
  type SaveTestAnswerResponse,
  type SimilarProblemResponse,
  SubmitProblemSetRequest,
  type TestResult,
  type TrapProblems,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { notFound } from '../common/app-error.js';
import { AnswerLogService } from './answer-log.service.js';
import { ErrorLogService } from './error-log.service.js';
import { MathProgressService } from './math-progress.service.js';
import { MathTestsService } from './math-tests.service.js';
import { MathTutorService } from './math-tutor.service.js';
import { PastPaperService } from './past-paper.service.js';
import { ProblemSetService } from './problem-set.service.js';

/**
 * Math track (math-design.md): marked problem sets, the error log, the answer record, skills,
 * timed tests, sprints and reviews, fact sheets and "Try a similar one".
 */
@Controller()
export class MathController {
  constructor(
    private readonly sets: ProblemSetService,
    private readonly errorLog: ErrorLogService,
    private readonly answers: AnswerLogService,
    private readonly tests: MathTestsService,
    private readonly progress: MathProgressService,
    private readonly pastPapers: PastPaperService,
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

  // ───────── Error log ─────────

  @Roles('STUDENT')
  @Get('math/error-log')
  errorLogList(
    @CurrentUser() user: AuthUser,
    @Query('track') track?: string,
  ): Promise<ErrorLogList> {
    return this.errorLog.list(user, track === 'mental' ? 'MENTAL' : 'MATH');
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

  // ───────── The past-paper log (letters and topic tags only, never problem text) ─────────

  @Roles('STUDENT')
  @Get('math/past-papers')
  pastPaperList(@CurrentUser() user: AuthUser): Promise<PastPaperList> {
    return this.pastPapers.list(user);
  }

  @Roles('STUDENT')
  @Post('math/past-papers')
  addPastPaper(
    @CurrentUser() user: AuthUser,
    @Body({ schema: CreatePastPaperRequest }) body: CreatePastPaperRequest,
  ): Promise<PastPaperView> {
    return this.pastPapers.create(user, body);
  }

  @Roles('STUDENT')
  @Delete('math/past-papers/:id')
  @HttpCode(204)
  removePastPaper(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<void> {
    return this.pastPapers.remove(user, id);
  }

  // ───────── The answer record, skills and home ─────────

  /** Practice answers checked in the browser, re-marked here (verdicts only are kept). */
  @Roles('STUDENT')
  @Post('math/answers')
  @HttpCode(200)
  practiceAnswers(
    @CurrentUser() user: AuthUser,
    @Body({ schema: PracticeAnswersRequest }) body: PracticeAnswersRequest,
  ): Promise<PracticeAnswersResponse> {
    return this.answers.practice(user, body);
  }

  @Roles('STUDENT')
  @Get('math/home')
  home(@CurrentUser() user: AuthUser): Promise<MathHome> {
    return this.progress.home(user);
  }

  @Roles('STUDENT')
  @Get('math/skills')
  skills(@CurrentUser() user: AuthUser): Promise<MathSkillsView> {
    return this.progress.skills(user);
  }

  @Get('math/facts/:unitNumber')
  facts(
    @CurrentUser() user: AuthUser,
    @Param('unitNumber') unitNumber: string,
  ): Promise<FactSheetView> {
    const n = Number(unitNumber);
    if (!Number.isInteger(n) || n < 1 || n > 15) throw notFound(ErrorCode.NOT_FOUND, 'Not found.');
    return this.progress.facts(user, n);
  }

  /** "Try a similar one" for a practice problem without a template. */
  @Roles('STUDENT')
  @Get('math/similar')
  similar(
    @CurrentUser() user: AuthUser,
    @Query('lessonId') lessonId: string,
    @Query('activityKey') activityKey: string,
    @Query('problemId') problemId: string,
  ): Promise<SimilarProblemResponse> {
    if (!lessonId || !activityKey || !problemId) throw notFound(ErrorCode.NOT_FOUND, 'Not found.');
    return this.progress.similar(user, lessonId, activityKey, problemId);
  }

  /** The reflect step's trap picker: this lesson's problems, the missed ones first. */
  @Roles('STUDENT')
  @Get('math/lessons/:lessonId/trap-problems')
  trapProblems(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
  ): Promise<TrapProblems> {
    return this.progress.trapProblems(user, lessonId);
  }

  // ───────── Tests, sprints and reviews ─────────

  @Roles('STUDENT')
  @Post('math/tests/:key/start')
  @HttpCode(200)
  startTest(@CurrentUser() user: AuthUser, @Param('key') key: string): Promise<MathTestView> {
    const parsed = MathStartKey.safeParse(key);
    if (!parsed.success) throw notFound(ErrorCode.NOT_FOUND, 'Test not found.');
    return this.tests.start(user, parsed.data);
  }

  @Roles('STUDENT')
  @Get('math/tests/attempts/:id')
  getAttempt(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<MathTestView | TestResult> {
    return this.tests.get(user, id);
  }

  @Roles('STUDENT')
  @Put('math/tests/attempts/:id/answer')
  saveAnswer(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SaveTestAnswerRequest }) body: SaveTestAnswerRequest,
  ): Promise<SaveTestAnswerResponse> {
    return this.tests.answer(user, id, body);
  }

  @Roles('STUDENT')
  @Post('math/tests/attempts/:id/submit')
  @HttpCode(200)
  submitTest(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<TestResult> {
    return this.tests.submit(user, id);
  }

  @Roles('STUDENT')
  @Get('math/tests/attempts/:id/review')
  reviewTest(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<TestResult> {
    return this.tests.review(user, id);
  }

  // ───────── Teacher ─────────

  /** The class's skills × students grid (another teacher's class answers 404). */
  @Roles('TEACHER')
  @Get('teacher/classes/:classId/math-skills')
  classSkills(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
  ): Promise<ClassMathSkills> {
    return this.progress.classSkills(user, classId);
  }
}

/** Quill on the Math track (math-design.md §3.3): never changes a verdict. */
@Roles('STUDENT')
@Controller('ai/math')
export class MathTutorController {
  constructor(private readonly tutor: MathTutorService) {}

  /** "Explain the solution" or "Why was my answer wrong?" (with optional typed working). */
  @Post('explain')
  @HttpCode(200)
  explain(
    @CurrentUser() user: AuthUser,
    @Body({ schema: MathExplainRequest }) body: MathExplainRequest,
  ): Promise<MathExplainResponse> {
    return this.tutor.explain(user, body);
  }

  /** "Give me a nudge": one guiding question after a wrong practice try. */
  @Post('nudge')
  @HttpCode(200)
  nudge(
    @CurrentUser() user: AuthUser,
    @Body({ schema: MathNudgeRequest }) body: MathNudgeRequest,
  ): Promise<MathNudgeResponse> {
    return this.tutor.nudge(user, body);
  }

  /** "Explain it another way" on a Math Learn card. */
  @Post('card')
  @HttpCode(200)
  card(
    @CurrentUser() user: AuthUser,
    @Body({ schema: MathCardRequest }) body: MathCardRequest,
  ): Promise<MathCardResponse> {
    return this.tutor.card(user, body);
  }
}
