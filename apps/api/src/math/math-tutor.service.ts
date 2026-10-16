import { HttpStatus, Injectable } from '@nestjs/common';
import { mathCardAnalyzer, mathExplainAnalyzer, mathNudgeAnalyzer } from '@storyforge/ai';
import {
  CHOICE_LETTERS,
  choiceValue,
  contentValue,
  equal,
  readAnswer,
  texToExpression,
} from '@storyforge/math-check';
import {
  ErrorCode,
  type LessonCard,
  LessonSteps,
  type MathCardRequest,
  type MathCardResponse,
  type MathExplainRequest,
  type MathExplainResponse,
  type MathNudgeRequest,
  type MathNudgeResponse,
  type MathProblem,
  answerLabel,
  markAnswer,
  splitMath,
} from '@storyforge/shared';
import { AiRunnerService } from '../ai/ai-runner.service.js';
import { TutorService } from '../ai/tutor.service.js';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, notFound } from '../common/app-error.js';
import { CurriculumService } from '../curriculum/curriculum.service.js';
import { SafetyService } from '../safety/safety.service.js';
import { MathContentService } from './math-content.service.js';

const unavailable = () =>
  new AppError(
    HttpStatus.SERVICE_UNAVAILABLE,
    ErrorCode.AI_UNAVAILABLE,
    'Try again',
    'Quill is busy right now. Try again in a moment.',
  );

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

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
 * dropped, so Quill can never change the verdict.
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

/** Every number written in a text (digits, with decimals). */
const numbersIn = (text: string) => new Set(text.match(/\d+(?:\.\d+)?/g) ?? []);

/**
 * A nudge is safe when it adds no number that isn't in the problem and names no answer letter
 * (math-design.md §3.3 C1).
 */
export function nudgeIsSafe(question: string, problem: MathProblem): boolean {
  const allowed = numbersIn(
    [problem.prompt, ...(problem.answer.kind === 'choice' ? problem.answer.choices : [])].join(' '),
  );
  for (const n of numbersIn(question)) if (!allowed.has(n)) return false;
  if (/\(([A-E])\)|\b(choice|answer|option) [A-E]\b/.test(question)) return false;
  return splitMath(question).ok;
}

/** Plain text for a Math Learn card (the math tutor reads it). */
function cardText(card: LessonCard): string {
  switch (card.kind) {
    case 'definition':
      return card.body;
    case 'example':
      return [card.text, card.note].filter(Boolean).join('\n');
    case 'worked-example':
      return [card.problem, ...card.steps.map((s, i) => `Step ${i + 1}: ${s.text}`)].join('\n');
    case 'compare':
      return [card.telling, card.showing, card.note].filter(Boolean).join('\n');
    default:
      return '';
  }
}

/**
 * Quill on the Math track (math-design.md §3.3): explanations and "Why was mine wrong?" (with
 * optional typed working), practice nudges, and the Learn-card tutor. The verdict always comes from
 * math-check; Quill's text is checked so it can't contradict it.
 */
@Injectable()
export class MathTutorService {
  constructor(
    private readonly ai: AiRunnerService,
    private readonly tutor: TutorService,
    private readonly curriculum: CurriculumService,
    private readonly content: MathContentService,
    private readonly safety: SafetyService,
  ) {}

  async explain(user: AuthUser, req: MathExplainRequest): Promise<MathExplainResponse> {
    const found = await this.content.locate(user, req, { afterHandIn: true });
    const { problem, classId } = found;
    if (!classId) throw notFound(ErrorCode.NOT_FOUND, 'Join a class to ask Quill.');
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
    const remaining = await this.tutor.checkLimit(user.id, classId);

    // "My working" is student text: screened like writing, never cached, never logged.
    let working = req.mode === 'mistake' ? (req.working ?? '').trim() : '';
    if (working) {
      const screen = await this.safety.screen(
        {
          text: working,
          activityTitle: 'Math working',
          prompt: problem.prompt,
          unitTitle: found.title,
          focusSkills: [problem.skill],
          gradeLevel: 9,
        },
        { studentId: user.id, classId, live: true },
      );
      if (screen.hold) working = '';
    }

    const answerKey = studentAnswer.toLowerCase().replace(/\s+/g, '');
    const outcome = await this.ai
      .run(
        mathExplainAnalyzer,
        {
          unitTitle: found.title,
          skill: problem.skill,
          problem: problem.prompt,
          choices: problem.answer.kind === 'choice' ? [...problem.answer.choices] : [],
          rightAnswer: answerLabel(problem),
          solution: problem.solution,
          mode: req.mode,
          studentAnswer: req.mode === 'mistake' ? studentAnswer : null,
          studentWorking: working || null,
          attempt: req.attempt,
        },
        {
          kind: 'tutor',
          userId: user.id,
          classId,
          cacheScope: `${req.activityKey}|${problem.id}#${problem.seed ?? ''}|${req.mode}|${answerKey}|try${req.attempt}`,
          text: '',
          noCache: Boolean(working),
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

  /** "Give me a nudge" in practice: one guiding question, checked for new numbers and letters. */
  async nudge(user: AuthUser, req: MathNudgeRequest): Promise<MathNudgeResponse> {
    const found = await this.content.locate(user, req, { afterHandIn: false });
    if (found.source !== 'PROBLEMS')
      throw notFound(ErrorCode.NOT_FOUND, 'Nudges are for practice problems.');
    const { problem, classId } = found;
    const mark = markAnswer(problem, req.answer);
    if (mark.verdict !== 'wrong' || !mark.readable)
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'Nothing to nudge',
        'Nudges come after a wrong try.',
      );
    const remaining = await this.tutor.checkLimit(user.id, classId);
    const answerKey = req.answer.toLowerCase().replace(/\s+/g, '');
    for (const strict of [false, true]) {
      const outcome = await this.ai
        .run(
          mathNudgeAnalyzer,
          {
            skill: problem.skill,
            problem: problem.prompt,
            choices: problem.answer.kind === 'choice' ? [...problem.answer.choices] : [],
            rightAnswer: answerLabel(problem),
            solution: problem.solution,
            studentAnswer: req.answer,
            attempt: req.attempt,
            strict,
          },
          {
            kind: 'tutor',
            userId: user.id,
            classId,
            cacheScope: `${req.activityKey}|${problem.id}#${problem.seed ?? ''}|nudge|${answerKey}|try${req.attempt}|${strict}`,
            text: '',
          },
        )
        .catch(() => null);
      if (!outcome || outcome.status === 'declined') break;
      const question = clip(outcome.result.question.trim(), 300);
      if (question && nudgeIsSafe(question, problem)) return { question, remaining };
    }
    // Two unsafe nudges (or none): the page shows the next authored hint instead.
    return { question: null, remaining };
  }

  /** "Explain it another way" on a Math Learn card (the writing tutor stays for Story and Essay). */
  async card(user: AuthUser, req: MathCardRequest): Promise<MathCardResponse> {
    const { lesson, unit, classId } = await this.curriculum.openLesson(user, req.lessonId);
    if (unit.track !== 'MATH') throw notFound(ErrorCode.NOT_FOUND, 'Card not found.');
    const card = LessonSteps.parse(lesson.steps)[1].cards[req.cardIndex];
    if (!card || !cardText(card)) throw notFound(ErrorCode.NOT_FOUND, 'Card not found.');
    const remaining = await this.tutor.checkLimit(user.id, classId);
    const outcome = await this.ai
      .run(
        mathCardAnalyzer,
        {
          unitTitle: unit.title,
          lessonTitle: lesson.title,
          cardTitle: card.title,
          cardText: cardText(card),
          attempt: req.attempt,
        },
        {
          kind: 'tutor',
          userId: user.id,
          classId,
          cacheScope: `${lesson.id}|mathcard${req.cardIndex}|try${req.attempt}`,
          text: '',
        },
      )
      .catch(() => {
        throw unavailable();
      });
    if (outcome.status === 'declined') throw unavailable();
    // The same guard as problems: a step stating a result the card doesn't is dropped.
    const stated = new Set(numbersIn(cardText(card)));
    const steps = outcome.result.steps
      .filter((s) => !/answer is/i.test(s) || [...numbersIn(s)].every((n) => stated.has(n)))
      .map((s) => clip(s, 600))
      .slice(0, 6);
    if (steps.length === 0) throw unavailable();
    return { steps, keyIdea: clip(outcome.result.keyIdea, 300), remaining };
  }
}
