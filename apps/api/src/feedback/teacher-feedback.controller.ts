import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { FeedbackService } from './feedback.service.js';

/** Minimal approval step for TEACHER_APPROVAL classes; the review screen arrives in P5. */
@Roles('TEACHER')
@Controller('teacher/feedback')
export class TeacherFeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  @Post(':feedbackId/release')
  @HttpCode(204)
  release(@CurrentUser() user: AuthUser, @Param('feedbackId') feedbackId: string): Promise<void> {
    return this.feedback.release(user, feedbackId);
  }
}
