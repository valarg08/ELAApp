import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import {
  SatPracticeAnswerRequest,
  type SatPracticeResponse,
  type SatPracticeView,
  type SatSkillStanding,
  type SatAttemptView,
  type SatMistake,
  SaveSatRequest,
  type SatWeekSummary,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { SatPracticeService } from './sat-practice.service.js';
import { SatService } from './sat.service.js';

/** SAT Math's weekly tests (sat-design.md): students only. */
@Controller('sat')
export class SatController {
  constructor(
    private readonly sat: SatService,
    private readonly practice: SatPracticeService,
  ) {}

  @Roles('STUDENT')
  @Get('weeks')
  weeks(@CurrentUser() user: AuthUser): Promise<SatWeekSummary[]> {
    return this.sat.weeks(user);
  }

  /** The questions missed in finished tests (the SAT's own mistakes list). */
  @Roles('STUDENT')
  @Get('mistakes')
  mistakes(@CurrentUser() user: AuthUser): Promise<SatMistake[]> {
    return this.sat.mistakes(user);
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

  // ───────── Adaptive practice ─────────

  /** The skills, weakest first. */
  @Roles('STUDENT')
  @Get('practice/skills')
  skills(@CurrentUser() user: AuthUser): Promise<SatSkillStanding[]> {
    return this.practice.skills(user);
  }

  @Roles('STUDENT')
  @Post('practice/start')
  @HttpCode(200)
  startPractice(@CurrentUser() user: AuthUser): Promise<SatPracticeView> {
    return this.practice.start(user);
  }

  @Roles('STUDENT')
  @Get('practice/:id')
  getPractice(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<SatPracticeView> {
    return this.practice.get(user, id);
  }

  @Roles('STUDENT')
  @Post('practice/:id/answer')
  @HttpCode(200)
  answerPractice(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SatPracticeAnswerRequest }) body: SatPracticeAnswerRequest,
  ): Promise<SatPracticeResponse> {
    return this.practice.answer(user, id, body);
  }
}
