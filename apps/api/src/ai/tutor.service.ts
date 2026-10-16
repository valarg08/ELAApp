import { HttpStatus, Injectable } from '@nestjs/common';
import {
  type ExtraPracticeResult,
  explainCardAnalyzer,
  extraPracticeAnalyzer,
  mathExplainAnalyzer,
} from '@storyforge/ai';
import {
  CHOICE_LETTERS,
  choiceValue,
  contentValue,
  equal,
  readAnswer,
  texToExpression,
} from '@storyforge/math-check';
import {
  ActivityContent,
  ErrorCode,
  type ExplainRequest,
  type ExplainResponse,
  type ExtraPracticeRequest,
  type ExtraPracticeResponse,
  type LessonCard,
  LessonSteps,
  type MathExplainRequest,
  type MathExplainResponse,
  type MathProblem,
  answerLabel,
  markAnswer,
  MultipleChoiceActivity,
  POV_VERSION_LABELS,
  type PracticeActivity,
  TUTOR_LIMITS,
  blankMatches,
  isWritingActivity,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, notFound } from '../common/app-error.js';
import { CurriculumService } from '../curriculum/curriculum.service.js';
import { DatabaseService } from '../database/database.service.js';
import { AiRunnerService } from './ai-runner.service.js';

const HOUR = 3_600_000;
/** Question sets per activity: repeat requests rotate through them (all cached and shared). */
const PRACTICE_VARIANTS = 3;
const OPTION_IDS = ['a', 'b', 'c', 'd'] as const;

const unavailable = () =>
  new AppError(
    HttpStatus.SERVICE_UNAVAILABLE,
    ErrorCode.AI_UNAVAILABLE,
    'Try again',
    'Quill is busy right now. Try again in a moment.',
  );

const SENSE_ORGANS = {
  sight: 'your eyes',
  sound: 'your ears',
  smell: 'your nose',
  taste: 'your tongue',
  touch: 'your skin or hands',
} as const;

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

function cardText(card: LessonCard): string {
  switch (card.kind) {
    case 'definition':
      return card.body;
    case 'example':
      return [card.text, card.note].filter(Boolean).join('\n');
    case 'compare':
      return [`Telling: ${card.telling}`, `Showing: ${card.showing}`, card.note]
        .filter(Boolean)
        .join('\n');
    case 'clue-hunt':
      return `${card.prompt}\n${card.text}\nClues: ${card.clues.join(', ')}`;
    case 'pov-simulator':
      return card.versions
        .map((v) => `${POV_VERSION_LABELS[v.pov]}: ${v.text}\n(The narrator knows: ${v.knows})`)
        .join('\n');
  }
  const unreachable: never = card;
  return String(unreachable);
}

const shuffle = <T>(items: readonly T[], seed: number): T[] =>
  items
    .map((item, i) => ({ item, key: (i * 7919 + seed * 104_729) % 1000 }))
    .toSorted((a, b) => a.key - b.key)
    .map((x) => x.item);

/** The activity as plain text for the prompt, plus offline questions built from its own items. */
function describeActivity(
  activity: PracticeActivity,
  variant: number,
): { text: string; fallback: ExtraPracticeResult['questions'] } {
  switch (activity.type) {
    case 'MULTIPLE_CHOICE':
      return {
        text: activity.questions
          .map((q) => {
            const right = q.options.find((o) => o.id === q.correctOptionId)?.text ?? '';
            return `Q: ${q.prompt}\nOptions: ${q.options.map((o) => o.text).join(' | ')}\nAnswer: ${right}`;
          })
          .join('\n\n'),
        fallback: shuffle(activity.questions, variant).map((q) => {
          const options = shuffle(q.options, variant + 1);
          return {
            prompt: q.prompt,
            options: options.map((o) => o.text),
            correctIndex: options.findIndex((o) => o.id === q.correctOptionId),
            explanation: q.explanation,
          };
        }),
      };
    case 'SORT': {
      const labels = activity.buckets.map((b) => b.label);
      return {
        text: `${activity.instructions}\nGroups: ${labels.join(', ')}\n${activity.items
          .map((i) => `- "${i.text}" → ${activity.buckets.find((b) => b.id === i.bucketId)?.label}`)
          .join('\n')}`,
        fallback: shuffle(activity.items, variant)
          .slice(0, 3)
          .map((item) => ({
            prompt: `Which group does this belong to? “${item.text}”`,
            options: labels,
            correctIndex: activity.buckets.findIndex((b) => b.id === item.bucketId),
            explanation: `It belongs in “${activity.buckets.find((b) => b.id === item.bucketId)?.label}”.`,
          })),
      };
    }
    case 'HIGHLIGHT': {
      const words = activity.text.match(/[\p{L}']+/gu) ?? [];
      const targets = new Set(activity.targets.map((t) => t.toLowerCase()));
      const others = [
        ...new Set(words.filter((w) => !targets.has(w.toLowerCase()) && w.length > 3)),
      ];
      return {
        text: `${activity.instructions}\nText: ${activity.text}\nAnswers: ${activity.targets.join(', ')}\nWhy: ${activity.explanation}`,
        fallback: shuffle(activity.targets, variant)
          .slice(0, 3)
          .map((target, i) => {
            const options = shuffle([target, ...others.slice(i * 2, i * 2 + 2)], variant + i);
            return {
              prompt: activity.instructions,
              options,
              correctIndex: options.indexOf(target),
              explanation: activity.explanation,
            };
          }),
      };
    }
    case 'SEQUENCE': {
      const { items, labels } = activity;
      return {
        text: [
          activity.instructions,
          'Correct order:',
          ...items.map((item, i) => `${i + 1}. ${labels?.[i] ? `${labels[i]}: ` : ''}${item.text}`),
          `Why: ${activity.explanation}`,
        ].join('\n'),
        fallback: shuffle(
          items.slice(0, -1).map((item, i) => ({ item, next: items[i + 1] })),
          variant,
        )
          .slice(0, 3)
          .flatMap(({ item, next }, i) => {
            if (!next) return [];
            const others = items.filter((x) => x.id !== item.id && x.id !== next.id).slice(0, 2);
            const options = shuffle([next, ...others], variant + i);
            return [
              {
                prompt: `What comes right after this? “${item.text}”`,
                options: options.map((o) => o.text),
                correctIndex: options.findIndex((o) => o.id === next.id),
                explanation: activity.explanation,
              },
            ];
          }),
      };
    }
    case 'SENSORY_LAB': {
      const senses = activity.stations.map((s) => s.sense);
      const pairs = activity.stations.flatMap((s) =>
        s.ideas.map((word) => ({ word, sense: s.sense })),
      );
      return {
        text: [
          activity.instructions,
          ...activity.stations.map(
            (s) => `${s.sense}: ${s.scene} Example words: ${s.ideas.join(', ')}`,
          ),
        ].join('\n'),
        fallback: shuffle(pairs, variant)
          .slice(0, 3)
          .map(({ word, sense }, i) => {
            // Questions take 2–4 options: the right sense and up to three others.
            const others = shuffle(
              senses.filter((s) => s !== sense),
              variant + i,
            ).slice(0, 3);
            // Rotate where the answer sits so it isn't always in the same place.
            const at = (variant + i * 3) % (others.length + 1);
            const options = [...others.slice(0, at), sense, ...others.slice(at)];
            return {
              prompt: `Which sense does “${word}” describe?`,
              options,
              correctIndex: options.indexOf(sense),
              explanation: `“${word}” is something you would notice with ${SENSE_ORGANS[sense]}.`,
            };
          }),
      };
    }
    case 'TRANSFORM': {
      const { items } = activity;
      return {
        text: [
          activity.instructions,
          ...items.map(
            (i) => `${i.task}: “${i.source}” → “${i.answers[0]}”. Why: ${i.explanation}`,
          ),
        ].join('\n'),
        fallback: shuffle(items, variant)
          .slice(0, 3)
          .map((item, i) => {
            // The right rewrite, the unchanged sentence, and another item's rewrite.
            const other = items.find((x) => x.id !== item.id)?.answers[0];
            const choices = [
              ...new Set([item.answers[0]!, item.source, ...(other ? [other] : [])]),
            ];
            const options = shuffle(choices, variant + i);
            return {
              prompt: `${item.task}: “${item.source}”`,
              options,
              correctIndex: options.indexOf(item.answers[0]!),
              explanation: item.explanation,
            };
          }),
      };
    }
    case 'FILL_BLANK': {
      const { items } = activity;
      return {
        text: [
          activity.instructions,
          ...items.map((i) => `"${i.sentence}" → ${i.answers[0]}. Why: ${i.explanation}`),
        ].join('\n'),
        fallback: shuffle(items, variant)
          .slice(0, 3)
          .flatMap((item, i) => {
            const right = item.answers[0]!;
            // The choices, or the other items' answers when the student typed.
            const pool = item.choices ?? activity.choices ?? items.map((x) => x.answers[0]!);
            const others = [...new Set(pool)].filter((c) => !blankMatches(c, item.answers));
            if (others.length === 0) return [];
            const options = shuffle([right, ...others.slice(0, 3)], variant + i);
            return [
              {
                prompt: `Which word fills the blank? “${item.sentence}”`,
                options,
                correctIndex: options.indexOf(right),
                explanation: item.explanation,
              },
            ];
          }),
      };
    }
    case 'ERROR_HUNT': {
      const { errors } = activity;
      return {
        text: [
          activity.instructions,
          `Text: ${activity.text}`,
          ...errors.map((e) => `Wrong: "${e.word}" → "${e.fixes[0]}". Why: ${e.explanation}`),
        ].join('\n'),
        fallback: shuffle(errors, variant)
          .slice(0, 3)
          .map((e, i) => {
            const right = e.fixes[0]!;
            const options = shuffle([...new Set([right, e.word])], variant + i);
            return {
              prompt: `Which is correct: “${e.word}” or “${right}”?`,
              options,
              correctIndex: options.indexOf(right),
              explanation: e.explanation,
            };
          }),
      };
    }
    // Unit-check quizzes are marked tests: no extra practice from their question bank.
    // Math problems get "Try a similar one" from the problem bank instead (DESIGN.md §9.13).
    case 'QUIZ':
    case 'PROBLEMS':
    case 'PROBLEM_SET':
    case 'REFLECTION':
      return { text: '', fallback: [] };
  }
  const unreachable: never = activity;
  return unreachable;
}

/** The value the right answer stands for, or null when it isn't a number. */
function valueOfAnswer(problem: MathProblem) {
  try {
    if (problem.answer.kind === 'choice')
      return choiceValue(problem.answer.choices[CHOICE_LETTERS.indexOf(problem.answer.correct)]!);
    return contentValue(problem.answer.accepted[0]!);
  } catch {
    return null;
  }
}

/**
 * True when a step states a final answer that isn't the right one ("the answer is $12$",
 * "the answer is (B)"), or, in mistake mode, calls the student's answer right. Such steps are
 * dropped (DESIGN.md §9.13).
 */
function contradicts(step: string, problem: MathProblem, mode: 'explain' | 'mistake'): boolean {
  if (
    mode === 'mistake' &&
    /\b(you were|you're|you are|your answer is) (right|correct)\b/i.test(step)
  )
    return true;
  const letter = /answer is\s*\(([A-E])\)/i.exec(step)?.[1];
  if (letter && problem.answer.kind === 'choice')
    return letter.toUpperCase() !== problem.answer.correct;
  const stated = /answer is\s*(\$[^$]+\$|[-\d./√π ]+\d)/i.exec(step)?.[1];
  if (!stated) return false;
  const read = readAnswer(texToExpression(stated));
  const right = valueOfAnswer(problem);
  return read.ok && right !== null && !equal(read.value, right);
}

/**
 * The AI tutor inside lessons (self-learning): re-explaining Learn cards and extra practice.
 * Inputs are lesson content only (no student writing), so results are cached and shared.
 */
@Injectable()
export class TutorService {
  constructor(
    private readonly db: DatabaseService,
    private readonly ai: AiRunnerService,
    private readonly curriculum: CurriculumService,
  ) {}

  async explain(user: AuthUser, req: ExplainRequest): Promise<ExplainResponse> {
    const { lesson, unit, classId } = await this.curriculum.openLesson(user, req.lessonId);
    const card = LessonSteps.parse(lesson.steps)[1].cards[req.cardIndex];
    if (!card) throw notFound(ErrorCode.NOT_FOUND, 'Card not found.');
    const remaining = await this.checkLimit(user.id, classId);
    const klass = await this.db.client.class.findUniqueOrThrow({ where: { id: classId } });

    const input = {
      unitTitle: unit.title,
      lessonTitle: lesson.title,
      gradeLevel: klass.gradeLevel,
      cardTitle: card.title,
      cardText: cardText(card),
      attempt: req.attempt,
    };
    const outcome = await this.ai
      .run(explainCardAnalyzer, input, {
        kind: 'tutor',
        userId: user.id,
        classId,
        cacheScope: `${lesson.id}|card${req.cardIndex}|try${req.attempt}|g${klass.gradeLevel}`,
        text: '',
      })
      .catch(() => {
        throw unavailable();
      });
    if (outcome.status === 'declined') throw unavailable();
    return { ...outcome.result, remaining };
  }

  async practice(user: AuthUser, req: ExtraPracticeRequest): Promise<ExtraPracticeResponse> {
    const { lesson, unit, classId } = await this.curriculum.openLesson(user, req.lessonId);
    const practiceStep = LessonSteps.parse(lesson.steps)[2];
    if (!practiceStep.activityKeys.includes(req.activityKey)) {
      throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Activity not found in this lesson.');
    }
    const row = await this.db.client.activity.findUnique({ where: { key: req.activityKey } });
    const activity = row ? ActivityContent.parse(row.config) : null;
    if (
      !activity ||
      isWritingActivity(activity) ||
      activity.type === 'REFLECTION' ||
      activity.type === 'QUIZ' ||
      activity.type === 'PROBLEMS' ||
      activity.type === 'PROBLEM_SET'
    ) {
      throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'There’s no extra practice for this activity.');
    }
    const remaining = await this.checkLimit(user.id, classId);
    const klass = await this.db.client.class.findUniqueOrThrow({ where: { id: classId } });

    const variant = Math.floor(Math.random() * PRACTICE_VARIANTS);
    const described = describeActivity(activity, variant);
    const outcome = await this.ai
      .run(
        extraPracticeAnalyzer,
        {
          unitTitle: unit.title,
          lessonTitle: lesson.title,
          gradeLevel: klass.gradeLevel,
          activityTitle: activity.title,
          activityText: described.text,
          variant,
          fallback: described.fallback,
        },
        {
          kind: 'tutor',
          userId: user.id,
          classId,
          cacheScope: `${activity.key}|v${variant}|g${klass.gradeLevel}`,
          text: '',
        },
      )
      .catch(() => {
        throw unavailable();
      });
    if (outcome.status === 'declined') throw unavailable();

    const questions = outcome.result.questions
      .filter(
        (q) =>
          q.options.length >= 2 &&
          q.options.length <= 4 &&
          new Set(q.options).size === q.options.length &&
          q.correctIndex >= 0 &&
          q.correctIndex < q.options.length,
      )
      .slice(0, 3)
      .map((q, i) => ({
        id: `q${i + 1}`,
        prompt: clip(q.prompt, 500),
        options: q.options.map((text, j) => ({ id: OPTION_IDS[j]!, text: clip(text, 300) })),
        correctOptionId: OPTION_IDS[q.correctIndex]!,
        explanation: clip(q.explanation, 500),
      }));
    if (questions.length === 0) throw unavailable();

    return {
      activity: MultipleChoiceActivity.parse({
        key: `${activity.key}-ai`,
        type: 'MULTIPLE_CHOICE',
        title: clip(`More practice: ${activity.title}`, 120),
        questions,
      }),
      remaining,
    };
  }

  /**
   * Quill on a Math problem (DESIGN.md §9.13). The verdict and the right answer come from
   * math-check; steps that state a different final answer are dropped, so Quill can never change
   * the verdict.
   */
  async mathExplain(user: AuthUser, req: MathExplainRequest): Promise<MathExplainResponse> {
    const { lesson, unit, classId } = await this.curriculum.openLesson(user, req.lessonId);
    const [, , practice, challenge] = LessonSteps.parse(lesson.steps);
    const used =
      practice.activityKeys.includes(req.activityKey) || challenge.activityKey === req.activityKey;
    const row = used
      ? await this.db.client.activity.findUnique({ where: { key: req.activityKey } })
      : null;
    const activity = row ? ActivityContent.safeParse(row.config).data : undefined;
    const problem =
      activity?.type === 'PROBLEMS' || activity?.type === 'PROBLEM_SET'
        ? activity.problems.find((p) => p.id === req.problemId)
        : undefined;
    if (!problem) throw notFound(ErrorCode.NOT_FOUND, 'Problem not found.');
    // A marked set's problems are explained only after the student has submitted an attempt.
    if (activity?.type === 'PROBLEM_SET') {
      const submitted = await this.db.client.quizAttempt.count({
        where: {
          studentId: user.id,
          lessonId: lesson.id,
          activityKey: activity.key,
          submittedAt: { not: null },
        },
      });
      if (submitted === 0) throw notFound(ErrorCode.NOT_FOUND, 'Finish the set first.');
    }
    const studentAnswer = req.mode === 'mistake' ? (req.answer ?? '').trim() : '';
    if (req.mode === 'mistake') {
      const mark = markAnswer(problem, studentAnswer);
      // Only real wrong answers get a "why": a right one, a blank or unreadable text does not.
      if (mark.verdict !== 'wrong' || !mark.readable)
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          ErrorCode.VALIDATION_FAILED,
          'Nothing to explain',
          'Quill explains wrong answers only.',
        );
    }
    const remaining = await this.checkLimit(user.id, classId);

    const answerKey = studentAnswer.toLowerCase().replace(/s+/g, '');
    const outcome = await this.ai
      .run(
        mathExplainAnalyzer,
        {
          unitTitle: unit.title,
          skill: problem.skill,
          problem: problem.prompt,
          choices: problem.answer.kind === 'choice' ? [...problem.answer.choices] : [],
          rightAnswer: answerLabel(problem),
          solution: problem.solution,
          mode: req.mode,
          studentAnswer: req.mode === 'mistake' ? studentAnswer : null,
          attempt: req.attempt,
        },
        {
          kind: 'tutor',
          userId: user.id,
          classId,
          cacheScope: `${req.activityKey}|${problem.id}|${req.mode}|${answerKey}|try${req.attempt}`,
          text: '',
        },
      )
      .catch(() => {
        throw unavailable();
      });
    if (outcome.status === 'declined') throw unavailable();

    const steps = outcome.result.steps
      .filter((step) => !contradicts(step, problem, req.mode))
      .map((step) => clip(step, 600))
      .slice(0, 8);
    if (steps.length === 0) throw unavailable();
    return {
      steps,
      keyIdea: clip(outcome.result.keyIdea, 300),
      likelyMistake:
        req.mode === 'mistake' && outcome.result.likelyMistake
          ? clip(outcome.result.likelyMistake, 500)
          : null,
      remaining,
    };
  }

  /** Tutor help per student per hour/day, capped by a class daily budget (DESIGN.md §8.8). */
  private async checkLimit(userId: string, classId: string) {
    const now = Date.now();
    const count = (where: object) =>
      this.db.client.aiUsage.count({ where: { kind: 'tutor', ...where } });
    const [hour, day, classDay] = await Promise.all([
      count({ userId, createdAt: { gt: new Date(now - HOUR) } }),
      count({ userId, createdAt: { gt: new Date(now - 24 * HOUR) } }),
      count({ classId, createdAt: { gt: new Date(now - 24 * HOUR) } }),
    ]);
    const classLeft = TUTOR_LIMITS.perClassDay - classDay;
    const left = {
      hour: Math.min(TUTOR_LIMITS.perStudentHour - hour, classLeft),
      day: Math.min(TUTOR_LIMITS.perStudentDay - day, classLeft),
    };
    if (left.hour <= 0 || left.day <= 0) {
      throw new AppError(
        HttpStatus.TOO_MANY_REQUESTS,
        ErrorCode.RATE_LIMITED,
        'Take a break',
        'You’ve asked Quill for lots of help. Try on your own for a bit, then come back.',
      );
    }
    return { hour: left.hour - 1, day: left.day - 1 };
  }
}
