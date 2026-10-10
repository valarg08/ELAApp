import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LiveCheckRequest, type LiveCheckResponse } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { LiveChecksService } from './live-checks.service.js';

@Roles('STUDENT')
@Controller('ai')
export class LiveChecksController {
  constructor(private readonly checks: LiveChecksService) {}

  /** "Ask Quill" from the Coach panel: `{ activityId, analyzer, text }`. */
  @Post('check')
  @HttpCode(200)
  check(
    @CurrentUser() user: AuthUser,
    @Body({ schema: LiveCheckRequest }) body: LiveCheckRequest,
  ): Promise<LiveCheckResponse> {
    return this.checks.check(user, body);
  }
}
