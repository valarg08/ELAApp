import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@storyforge/shared';
import { AnalyzerParseError } from '@storyforge/ai';
import { AppError } from '../common/app-error.js';

/** The parts of an Anthropic SDK error we read (the API package doesn't depend on the SDK). */
interface SdkError {
  status?: number;
  error?: { error?: { type?: string; message?: string } };
  constructor: { name: string };
}

const fail = (title: string, detail: string) =>
  new AppError(HttpStatus.SERVICE_UNAVAILABLE, ErrorCode.AI_UNAVAILABLE, title, detail);

/** Anthropic's own message for a failed call (never contains student text). */
export function aiErrorReason(error: unknown): string {
  if (!(error instanceof Error)) return 'unknown error';
  const e = error as unknown as SdkError;
  const message = e.error?.error?.message ?? error.message;
  return e.status ? `${e.status} ${message}` : `${e.constructor.name}: ${message}`;
}

/**
 * What Quill tells the student when a Claude call fails: the real reason in plain words, so a setup
 * problem (key, credit, workspace) isn't mistaken for Quill being busy. Setup problems include
 * Anthropic's message so the teacher or admin can fix them.
 */
export function aiFailure(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof AnalyzerParseError)
    return fail('Try again', 'Quill’s answer came back garbled. Try again.');
  if (!(error instanceof Error))
    return fail('Try again', 'Quill hit an unexpected error. Try again.');

  const e = error as unknown as SdkError;
  const anthropic = e.error?.error?.message ?? error.message;
  const name = e.constructor.name;
  if (name === 'APIConnectionTimeoutError')
    return fail('Try again', 'Quill took too long to answer. Try again in a moment.');
  if (name === 'APIConnectionError')
    return fail(
      'Try again',
      'Quill couldn’t reach the AI service. Check the connection and try again.',
    );

  switch (e.status) {
    case 401:
    case 403:
      return fail(
        'Quill isn’t set up',
        `The AI service rejected the site’s API key. Tell your teacher. (${anthropic})`,
      );
    case 400:
      return /credit balance/i.test(anthropic)
        ? fail(
            'Quill is paused',
            'The AI account has run out of credit. Tell your teacher so the admin can add more.',
          )
        : fail(
            'Quill isn’t set up',
            `The AI service refused the request. Tell your teacher. (${anthropic})`,
          );
    case 429:
      return fail('Try again', 'Lots of people are using Quill right now. Try again in a minute.');
    case 529:
      return fail(
        'Try again',
        'The AI service is overloaded right now. Try again in a few minutes.',
      );
    default:
      return e.status && e.status >= 500
        ? fail('Try again', 'The AI service had a problem. Try again in a few minutes.')
        : fail('Try again', `Quill hit an error: ${anthropic}`);
  }
}

/** Claude declined to answer (a refusal): not an error, so say so plainly. */
export const aiDeclined = () =>
  new AppError(
    HttpStatus.SERVICE_UNAVAILABLE,
    ErrorCode.AI_UNAVAILABLE,
    'Try again',
    'Quill can’t help with this one. Try asking another way.',
  );
