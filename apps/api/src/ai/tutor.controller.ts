import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ExplainRequest,
  type ExplainResponse,
  ExtraPracticeRequest,
  type ExtraPracticeResponse,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { TutorService } from './tutor.service.js';

/** AI tutor inside lessons (self-learning). */
@Roles('STUDENT')
@Controller('ai')
export class TutorController {
  constructor(private readonly tutor: TutorService) {}

  /** "Explain it another way" on a Learn card. */
  @Post('explain')
  @HttpCode(200)
  explain(
    @CurrentUser() user: AuthUser,
    @Body({ schema: ExplainRequest }) body: ExplainRequest,
  ): Promise<ExplainResponse> {
    return this.tutor.explain(user, body);
  }

  /** Extra multiple-choice practice on a practice activity's skill. */
  @Post('practice')
  @HttpCode(200)
  practice(
    @CurrentUser() user: AuthUser,
    @Body({ schema: ExtraPracticeRequest }) body: ExtraPracticeRequest,
  ): Promise<ExtraPracticeResponse> {
    return this.tutor.practice(user, body);
  }
}
