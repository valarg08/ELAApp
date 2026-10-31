import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { type SatClassResults, type SatSchedule, SetSatScheduleRequest } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { SatResultsService } from './sat-results.service.js';
import { SatScheduleService } from './sat-schedule.service.js';

/** A teacher's class and the SAT: the schedule (sat-design.md §3) and the results (§8). */
@Roles('TEACHER')
@Controller('teacher')
export class SatScheduleController {
  constructor(
    private readonly schedule: SatScheduleService,
    private readonly results: SatResultsService,
  ) {}

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

  /** The class's scores by student and week, and right answers by content area and skill. */
  @Get('classes/:classId/sat-results')
  classResults(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
  ): Promise<SatClassResults> {
    return this.results.classResults(user, classId);
  }
}
