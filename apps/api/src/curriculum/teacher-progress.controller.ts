import { Controller, Get, Param, Query } from '@nestjs/common';
import { type ClassProgress, type StudentProgressDetail, Track } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { TeacherProgressService } from './teacher-progress.service.js';

const trackOf = (value?: string): Track => Track.catch('STORY').parse(value?.toUpperCase());

/** Student progress for teachers (DESIGN.md §11.3). Own classes and their students only. */
@Roles('TEACHER')
@Controller('teacher/classes/:classId')
export class TeacherProgressController {
  constructor(private readonly progress: TeacherProgressService) {}

  /** The class heatmap for one unit of a track, with this week's numbers. */
  @Get('progress')
  classProgress(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Query('track') track?: string,
    @Query('unit') unit?: string,
  ): Promise<ClassProgress> {
    const number = Number.parseInt(unit ?? '', 10);
    return this.progress.classProgress(
      user,
      classId,
      trackOf(track),
      Number.isNaN(number) ? undefined : number,
    );
  }

  /** One student's tracker, recent activity and confidence check-ins. */
  @Get('students/:studentId/progress')
  studentProgress(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
    @Query('track') track?: string,
  ): Promise<StudentProgressDetail> {
    return this.progress.studentProgress(user, classId, studentId, trackOf(track));
  }
}
