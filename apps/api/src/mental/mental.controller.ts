import { Controller, Get, Param } from '@nestjs/common';
import {
  type ClassMentalSkills,
  ErrorCode,
  type FactSheetView,
  type MentalHome,
  type MentalProgress,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { notFound } from '../common/app-error.js';
import { MentalPracticeService } from '../math/mental-practice.service.js';
import { MentalService } from './mental.service.js';

@Controller('mental')
export class MentalController {
  constructor(private readonly mental: MentalService) {}

  @Roles('STUDENT')
  @Get('home')
  home(@CurrentUser() user: AuthUser): Promise<MentalHome> {
    return this.mental.home(user);
  }

  @Roles('STUDENT')
  @Get('progress')
  progress(@CurrentUser() user: AuthUser): Promise<MentalProgress> {
    return this.mental.progress(user);
  }

  @Get('cheat-sheets/:unitNumber')
  cheatSheet(
    @CurrentUser() user: AuthUser,
    @Param('unitNumber') unitNumber: string,
  ): Promise<FactSheetView> {
    const n = Number(unitNumber);
    if (!Number.isInteger(n) || n < 1 || n > 15) throw notFound(ErrorCode.NOT_FOUND, 'Not found.');
    return this.mental.cheatSheet(user, n);
  }
}

/** The teacher's Mental Math skills view (another teacher's class answers 404). */
@Roles('TEACHER')
@Controller('teacher/classes')
export class MentalTeacherController {
  constructor(private readonly practice: MentalPracticeService) {}

  @Get(':classId/mental-skills')
  classSkills(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
  ): Promise<ClassMentalSkills> {
    return this.practice.classSkills(user, classId);
  }
}
