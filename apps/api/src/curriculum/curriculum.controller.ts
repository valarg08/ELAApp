import { Body, Controller, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import {
  type ClassUnitPacing,
  type LessonDetail,
  type LessonProgressView,
  type UnitDetail,
  type UnitSummary,
  UpdatePacingRequest,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { CurriculumService } from './curriculum.service.js';
import { PacingService } from './pacing.service.js';

@Controller()
export class CurriculumController {
  constructor(private readonly curriculum: CurriculumService) {}

  @Get('units')
  units(@CurrentUser() user: AuthUser, @Query('classId') classId?: string): Promise<UnitSummary[]> {
    return this.curriculum.listUnits(user, classId);
  }

  /** Accepts the unit id or its slug (e.g. "foundations"). */
  @Get('units/:unit')
  unit(
    @CurrentUser() user: AuthUser,
    @Param('unit') unit: string,
    @Query('classId') classId?: string,
  ): Promise<UnitDetail> {
    return this.curriculum.getUnit(user, unit, classId);
  }

  @Get('lessons/:lessonId')
  lesson(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
  ): Promise<LessonDetail> {
    return this.curriculum.getLesson(user, lessonId);
  }

  /** Body depends on the step; validated in the service (see STEP_RESPONSE_SCHEMAS). */
  @Roles('STUDENT')
  @Post('lessons/:lessonId/steps/:stepId/complete')
  @HttpCode(200)
  complete(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Param('stepId') stepId: string,
    @Body() body: unknown,
  ): Promise<LessonProgressView> {
    return this.curriculum.completeStep(user, lessonId, stepId, body);
  }
}

@Roles('TEACHER')
@Controller('teacher/classes/:classId/units')
export class PacingController {
  constructor(private readonly pacing: PacingService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
  ): Promise<ClassUnitPacing[]> {
    return this.pacing.list(user, classId);
  }

  @Put(':unitId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Param('unitId') unitId: string,
    @Body({ schema: UpdatePacingRequest }) body: UpdatePacingRequest,
  ): Promise<ClassUnitPacing> {
    return this.pacing.update(user, classId, unitId, body);
  }
}
