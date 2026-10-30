import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { type SatAttemptView, SaveSatRequest, type SatWeekSummary } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { SatService } from './sat.service.js';

/** SAT Math's weekly tests (sat-design.md): students only. */
@Controller('sat')
export class SatController {
  constructor(private readonly sat: SatService) {}

  @Roles('STUDENT')
  @Get('weeks')
  weeks(@CurrentUser() user: AuthUser): Promise<SatWeekSummary[]> {
    return this.sat.weeks(user);
  }

  @Roles('STUDENT')
  @Post('weeks/:week/start')
  @HttpCode(200)
  start(
    @CurrentUser() user: AuthUser,
    @Param('week', ParseIntPipe) week: number,
  ): Promise<SatAttemptView> {
    return this.sat.start(user, week);
  }

  @Roles('STUDENT')
  @Get('attempts/:id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<SatAttemptView> {
    return this.sat.get(user, id);
  }

  @Roles('STUDENT')
  @Put('attempts/:id/answers')
  save(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SaveSatRequest }) body: SaveSatRequest,
  ): Promise<SatAttemptView> {
    return this.sat.save(user, id, body);
  }

  @Roles('STUDENT')
  @Post('attempts/:id/submit')
  @HttpCode(200)
  submit(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<SatAttemptView> {
    return this.sat.submit(user, id);
  }
}
