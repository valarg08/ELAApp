import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { type SatSchedule, SetSatScheduleRequest } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { SatScheduleService } from './sat-schedule.service.js';

/** The SAT schedule of a teacher's class (sat-design.md §3). */
@Roles('TEACHER')
@Controller('teacher')
export class SatScheduleController {
  constructor(private readonly schedule: SatScheduleService) {}

  @Get('classes/:classId/sat-schedule')
  get(@CurrentUser() user: AuthUser, @Param('classId') classId: string): Promise<SatSchedule> {
    return this.schedule.get(user, classId);
  }

  @Put('classes/:classId/sat-schedule')
  set(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Body({ schema: SetSatScheduleRequest }) body: SetSatScheduleRequest,
  ): Promise<SatSchedule> {
    return this.schedule.set(user, classId, body);
  }
}
