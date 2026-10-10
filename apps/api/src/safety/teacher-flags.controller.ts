import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { FlagStatus, type SafetyFlagView, UpdateFlagRequest } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { SafetyService } from './safety.service.js';

/** Safety flag inbox (DESIGN.md §11.7, basic version; the full dashboard is P5). */
@Roles('TEACHER')
@Controller('teacher')
export class TeacherFlagsController {
  constructor(private readonly safety: SafetyService) {}

  /** `?status=OPEN|ACKNOWLEDGED|RESOLVED|ALL` (default OPEN). */
  @Get('classes/:classId/flags')
  list(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Query('status') status?: string,
  ): Promise<SafetyFlagView[]> {
    const parsed = FlagStatus.safeParse(status);
    return this.safety.list(
      user,
      classId,
      status === 'ALL' ? 'ALL' : parsed.success ? parsed.data : 'OPEN',
    );
  }

  @Patch('flags/:flagId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('flagId') flagId: string,
    @Body({ schema: UpdateFlagRequest }) body: UpdateFlagRequest,
  ): Promise<SafetyFlagView> {
    return this.safety.update(user, flagId, body);
  }
}
