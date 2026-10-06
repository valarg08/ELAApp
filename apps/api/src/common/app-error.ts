import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@storyforge/shared';

/** An HTTP error that the ProblemDetailsFilter turns into an RFC 9457 response. */
export class AppError extends HttpException {
  constructor(
    status: HttpStatus,
    readonly code: ErrorCode,
    readonly title: string,
    readonly detail?: string,
    readonly errors?: string[],
  ) {
    super({ code, title, detail }, status);
  }
}

export const unauthenticated = (detail = 'Please log in.') =>
  new AppError(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHENTICATED, 'Not logged in', detail);

export const forbidden = (detail = 'You do not have access to this.') =>
  new AppError(HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, 'Forbidden', detail);

/**
 * Other people's resources answer 404, not 403, so that ids cannot be probed.
 */
export const notFound = (code: ErrorCode = ErrorCode.NOT_FOUND, detail = 'Not found.') =>
  new AppError(HttpStatus.NOT_FOUND, code, 'Not found', detail);
