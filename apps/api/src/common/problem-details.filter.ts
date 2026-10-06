import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorCode, type ProblemDetails } from '@storyforge/shared';
import type { Response } from 'express';
import { AppError } from './app-error.js';

const STATUS_CODES: Partial<Record<number, ErrorCode>> = {
  400: ErrorCode.VALIDATION_FAILED,
  401: ErrorCode.UNAUTHENTICATED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
};

const toType = (code: string) => `/errors/${code.toLowerCase().replaceAll('_', '-')}`;

/** Every error leaves the API as RFC 9457 problem details (DESIGN.md §5.1). */
@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    const problem = this.toProblem(exception);
    res.status(problem.status).type('application/problem+json').json(problem);
  }

  private toProblem(exception: unknown): ProblemDetails {
    if (exception instanceof AppError) {
      return {
        type: toType(exception.code),
        title: exception.title,
        status: exception.getStatus(),
        code: exception.code,
        ...(exception.detail ? { detail: exception.detail } : {}),
        ...(exception.errors?.length ? { errors: exception.errors } : {}),
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const code = STATUS_CODES[status] ?? ErrorCode.INTERNAL;
      const body = exception.getResponse();
      const message =
        typeof body === 'object' && body !== null && 'message' in body ? body.message : body;
      const errors = Array.isArray(message) ? message.map(String) : undefined;
      return {
        type: toType(code),
        title: status === 400 ? 'Invalid request' : exception.message,
        status,
        code,
        ...(errors ? { errors, detail: errors.join('; ') } : {}),
      };
    }

    this.logger.error(
      exception instanceof Error ? (exception.stack ?? exception.message) : exception,
    );
    return {
      type: toType(ErrorCode.INTERNAL),
      title: 'Something went wrong',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL,
    };
  }
}
