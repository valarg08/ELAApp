import { HttpStatus, Injectable } from '@nestjs/common';
import {
  type AnalyzerOutcome,
  type CharacterReadResult,
  type SettingMoodResult,
  type PlotCheckResult,
  type PovConsistencyResult,
  type ToneStyleResult,
  type FigurativeLanguageResult,
  type PoetryCraftResult,
  type GrammarCheckResult,
  type FeedbackPoint,
  HOLDING_MESSAGE,
  LIVE_ANALYZERS,
  PERSONAL_INFO_REMINDER,
  type SensoryResult,
  type ShowVsTellResult,
  WANT_FEAR_TYPES,
  type WritingContext,
  analyzersForActivity,
  characterReadPoints,
  settingMoodPoints,
  plotCheckPoints,
  povPoints,
  tonePoints,
  figurativePoints,
  poetryPoints,
  grammarPoints,
  paragraphPoints,
  type ParagraphStructureResult,
  essayPoints,
  type EssayStructureResult,
  sensoryPoints,
  showVsTellPoints,
} from '@storyforge/ai';
import {
  ActivityContent,
  ErrorCode,
  LIVE_CHECK_LIMITS,
  type LiveCheckRequest,
  type LiveCheckResponse,
  isWritingActivity,
  validMoods,
  validTraits,
} from '@storyforge/shared';
import { countWords } from '@storyforge/writing-analysis';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, notFound } from '../common/app-error.js';
import { CurriculumService } from '../curriculum/curriculum.service.js';
import { DatabaseService } from '../database/database.service.js';
import { SafetyService } from '../safety/safety.service.js';
import { AiRunnerService } from './ai-runner.service.js';
import { plotInput, plotScope } from './plot-input.js';
import { povInput, toneInput, toneScope } from './voice-input.js';
import { poemInput, poemScope } from './poem-input.js';
import { grammarInput } from './grammar-input.js';
import { paragraphInput } from './paragraph-input.js';
import { essayInput } from './essay-input.js';

/** Live checks give up after 20 s (DESIGN.md §8.6) and ask the student to try again. */
const LIVE_TIMEOUT_MS = 20_000;
const HOUR = 3_600_000;

const unavailable = () =>
  new AppError(
    HttpStatus.SERVICE_UNAVAILABLE,
    ErrorCode.AI_UNAVAILABLE,
    'Try again',
    'Quill is thinking too hard. Try again in a moment.',
  );

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(unavailable()), LIVE_TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * "Ask Quill" (DESIGN.md §5.5): one AI analyzer on the current draft, rate limited per student and
 * class (§8.8), cached by content, and screened by the safety check first.
 */
@Injectable()
export class LiveChecksService {
  constructor(
    private readonly db: DatabaseService,
    private readonly ai: AiRunnerService,
    private readonly safety: SafetyService,
    private readonly curriculum: CurriculumService,
  ) {}

  async check(user: AuthUser, req: LiveCheckRequest): Promise<LiveCheckResponse> {
    const activity = await this.db.client.activity.findUnique({
      where: { id: req.activityId },
      include: { unit: true },
    });
    const content = activity ? ActivityContent.parse(activity.config) : null;
    if (!activity || !content || !isWritingActivity(content) || !activity.unit.published) {
      throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Writing activity not found.');
    }
    if (
      req.analyzer !== 'show-vs-tell' &&
      req.analyzer !== 'sensory-analysis' &&
      !analyzersForActivity(content.type).includes(req.analyzer)
    ) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'Not for this activity',
        'Quill can’t run that check on this activity.',
      );
    }
    const classId = await this.curriculum.studentClassForUnit(user, activity.unit);

    const words = countWords(req.text);
    if (words < LIVE_CHECK_LIMITS.minWords) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.TEXT_TOO_SHORT,
        'Keep writing',
        `Write at least ${LIVE_CHECK_LIMITS.minWords} words, then ask Quill.`,
      );
    }
    if (words > LIVE_CHECK_LIMITS.maxWords) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.TEXT_TOO_LONG,
        'Too long',
        `Quill can read up to ${LIVE_CHECK_LIMITS.maxWords} words at a time.`,
      );
    }

    const remaining = await this.remaining(user.id, classId);
    if (remaining.hour <= 0 || remaining.day <= 0) {
      throw new AppError(
        HttpStatus.TOO_MANY_REQUESTS,
        ErrorCode.RATE_LIMITED,
        'Take a break',
        remaining.day <= 0
          ? 'You’ve used all of today’s Quill checks. Try the instant checks, or come back tomorrow.'
          : 'You’ve asked Quill a lot this hour. Keep writing and try again later.',
      );
    }

    const klass = await this.db.client.class.findUniqueOrThrow({ where: { id: classId } });
    const ctx: WritingContext = {
      text: req.text,
      activityTitle: content.title,
      prompt: content.prompt,
      unitTitle: activity.unit.title,
      focusSkills: [],
      gradeLevel: klass.gradeLevel,
    };
    const meta = {
      kind: 'live' as const,
      userId: user.id,
      classId,
      cacheScope: activity.key,
      text: req.text,
    };

    try {
      // Every check runs the safety screen once; those rows are what the rate limit counts.
      const screen = await withTimeout(
        this.safety.screen(ctx, { studentId: user.id, classId, live: true }),
      );
      const after = { hour: remaining.hour - 1, day: remaining.day - 1 };
      if (screen.hold) {
        return {
          held: true,
          message: HOLDING_MESSAGE,
          strengths: [],
          nextSteps: [],
          remaining: after,
        };
      }

      let points: { strengths: FeedbackPoint[]; nextSteps: FeedbackPoint[] };
      if (req.analyzer === 'show-vs-tell') {
        const outcome: AnalyzerOutcome<ShowVsTellResult> = await withTimeout(
          this.ai.run(LIVE_ANALYZERS['show-vs-tell'], ctx, meta),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = showVsTellPoints(req.text, outcome.result);
      } else if (req.analyzer === 'sensory-analysis') {
        const outcome: AnalyzerOutcome<SensoryResult> = await withTimeout(
          this.ai.run(LIVE_ANALYZERS['sensory-analysis'], ctx, meta),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = sensoryPoints(req.text, outcome.result);
      } else if (req.analyzer === 'plot-check') {
        const extra = plotInput(content, req.conflict, req.plot);
        const outcome: AnalyzerOutcome<PlotCheckResult> = await withTimeout(
          this.ai.run(
            LIVE_ANALYZERS['plot-check'],
            { ...ctx, ...extra },
            { ...meta, cacheScope: `${activity.key}|${plotScope(extra)}` },
          ),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = plotCheckPoints(req.text, outcome.result, extra.conflict?.label ?? null);
      } else if (req.analyzer === 'pov-consistency') {
        const extra = povInput(content);
        const outcome: AnalyzerOutcome<PovConsistencyResult> = await withTimeout(
          this.ai.run(LIVE_ANALYZERS['pov-consistency'], { ...ctx, ...extra }, meta),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = povPoints(req.text, outcome.result, extra.narrator);
      } else if (req.analyzer === 'poetry-craft') {
        const extra = poemInput(content, req.syllables);
        const outcome: AnalyzerOutcome<PoetryCraftResult> = await withTimeout(
          this.ai.run(
            LIVE_ANALYZERS['poetry-craft'],
            { ...ctx, ...extra },
            { ...meta, cacheScope: `${activity.key}|${poemScope(extra)}` },
          ),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = poetryPoints(req.text, outcome.result);
      } else if (req.analyzer === 'grammar-check') {
        const outcome: AnalyzerOutcome<GrammarCheckResult> = await withTimeout(
          this.ai.run(LIVE_ANALYZERS['grammar-check'], { ...ctx, ...grammarInput(content) }, meta),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = grammarPoints(req.text, outcome.result);
      } else if (req.analyzer === 'paragraph-structure') {
        const outcome: AnalyzerOutcome<ParagraphStructureResult> = await withTimeout(
          this.ai.run(
            LIVE_ANALYZERS['paragraph-structure'],
            { ...ctx, ...paragraphInput(content) },
            meta,
          ),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = paragraphPoints(req.text, outcome.result);
      } else if (req.analyzer === 'essay-structure') {
        const outcome: AnalyzerOutcome<EssayStructureResult> = await withTimeout(
          this.ai.run(LIVE_ANALYZERS['essay-structure'], { ...ctx, ...essayInput(content) }, meta),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = essayPoints(req.text, outcome.result);
      } else if (req.analyzer === 'figurative-language') {
        const goals = content.figurativeHelper?.devices ?? [];
        const outcome: AnalyzerOutcome<FigurativeLanguageResult> = await withTimeout(
          this.ai.run(LIVE_ANALYZERS['figurative-language'], { ...ctx, goals }, meta),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = figurativePoints(req.text, outcome.result);
      } else if (req.analyzer === 'tone-style') {
        const extra = toneInput(content, req.tone);
        const outcome: AnalyzerOutcome<ToneStyleResult> = await withTimeout(
          this.ai.run(
            LIVE_ANALYZERS['tone-style'],
            { ...ctx, ...extra },
            { ...meta, cacheScope: `${activity.key}|${toneScope(extra)}` },
          ),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = tonePoints(req.text, outcome.result);
      } else if (req.analyzer === 'setting-mood') {
        const moods = validMoods(content, req.mood);
        const outcome: AnalyzerOutcome<SettingMoodResult> = await withTimeout(
          this.ai.run(
            LIVE_ANALYZERS['setting-mood'],
            { ...ctx, targetMoods: moods },
            { ...meta, cacheScope: `${activity.key}|${moods.join(',')}` },
          ),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = settingMoodPoints(req.text, outcome.result);
      } else {
        const traits = validTraits(content, req.traits);
        const checkWantFear = WANT_FEAR_TYPES.includes(content.type);
        const outcome: AnalyzerOutcome<CharacterReadResult> = await withTimeout(
          this.ai.run(
            LIVE_ANALYZERS['character-read'],
            { ...ctx, targetTraits: traits, checkWantFear },
            { ...meta, cacheScope: `${activity.key}|${traits.join(',')}` },
          ),
        );
        if (outcome.status === 'declined') return this.declined(after);
        points = characterReadPoints(req.text, outcome.result, checkWantFear);
      }

      const reminder: FeedbackPoint[] = screen.personalInfo
        ? [{ title: 'Keep it private', message: PERSONAL_INFO_REMINDER }]
        : [];
      return {
        held: false,
        message: null,
        strengths: points.strengths,
        nextSteps: [...reminder, ...points.nextSteps].slice(0, 3),
        remaining: after,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw unavailable();
    }
  }

  private declined(remaining: LiveCheckResponse['remaining']): LiveCheckResponse {
    return {
      held: true,
      message: 'Quill can’t comment on this one. Your teacher will read it.',
      strengths: [],
      nextSteps: [],
      remaining,
    };
  }

  /** Checks left for this student (per hour and per day), capped by the class's daily limit. */
  private async remaining(userId: string, classId: string) {
    const now = Date.now();
    const [hour, day, classDay] = await Promise.all([
      this.db.client.aiUsage.count({
        where: { userId, kind: 'live-safety', createdAt: { gt: new Date(now - HOUR) } },
      }),
      this.db.client.aiUsage.count({
        where: { userId, kind: 'live-safety', createdAt: { gt: new Date(now - 24 * HOUR) } },
      }),
      this.db.client.aiUsage.count({
        where: { classId, kind: 'live-safety', createdAt: { gt: new Date(now - 24 * HOUR) } },
      }),
    ]);
    const classLeft = LIVE_CHECK_LIMITS.perClassDay - classDay;
    return {
      hour: Math.min(LIVE_CHECK_LIMITS.perStudentHour - hour, classLeft),
      day: Math.min(LIVE_CHECK_LIMITS.perStudentDay - day, classLeft),
    };
  }
}
