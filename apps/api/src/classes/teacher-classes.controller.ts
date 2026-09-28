import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  BulkAddStudentsRequest,
  type ClassSummary,
  CreateClassRequest,
  LoginCardsRequest,
  ResetSecretRequest,
  type StudentCredential,
  type StudentSummary,
  UpdateClassRequest,
} from '@storyforge/shared';
import type { Response } from 'express';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { ClassesService } from './classes.service.js';
import { LoginCardsService } from './login-cards.service.js';

@Roles('TEACHER')
@Controller('teacher')
export class TeacherClassesController {
  constructor(
    private readonly classes: ClassesService,
    private readonly cards: LoginCardsService,
  ) {}

  @Get('classes')
  list(
    @CurrentUser() user: AuthUser,
    @Query('includeArchived') includeArchived?: string,
  ): Promise<ClassSummary[]> {
    return this.classes.list(user, includeArchived === 'true');
  }

  @Post('classes')
  create(
    @CurrentUser() user: AuthUser,
    @Body({ schema: CreateClassRequest }) body: CreateClassRequest,
  ): Promise<ClassSummary> {
    return this.classes.create(user, body);
  }

  @Get('classes/:classId')
  get(@CurrentUser() user: AuthUser, @Param('classId') classId: string): Promise<ClassSummary> {
    return this.classes.get(user, classId);
  }

  @Patch('classes/:classId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Body({ schema: UpdateClassRequest }) body: UpdateClassRequest,
  ): Promise<ClassSummary> {
    return this.classes.update(user, classId, body);
  }

  @Delete('classes/:classId')
  @HttpCode(204)
  archive(@CurrentUser() user: AuthUser, @Param('classId') classId: string): Promise<void> {
    return this.classes.archive(user, classId);
  }

  @Get('classes/:classId/students')
  students(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
  ): Promise<StudentSummary[]> {
    return this.classes.listStudents(user, classId);
  }

  @Post('classes/:classId/students/bulk')
  bulkAdd(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Body({ schema: BulkAddStudentsRequest }) body: BulkAddStudentsRequest,
  ): Promise<StudentCredential[]> {
    return this.classes.bulkAdd(user, classId, body);
  }

  @Post('students/:studentId/reset-secret')
  @HttpCode(200)
  resetSecret(
    @CurrentUser() user: AuthUser,
    @Param('studentId') studentId: string,
    @Body({ schema: ResetSecretRequest }) body: ResetSecretRequest,
  ): Promise<StudentCredential> {
    return this.classes.resetSecret(user, studentId, body.secretKind);
  }

  @Post('classes/:classId/login-cards')
  @HttpCode(200)
  async loginCards(
    @CurrentUser() user: AuthUser,
    @Param('classId') classId: string,
    @Body({ schema: LoginCardsRequest }) body: LoginCardsRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const pdf = await this.cards.render(user, classId, body);
    res.setHeader('Cache-Control', 'no-store');
    return new StreamableFile(pdf, {
      type: 'application/pdf',
      disposition: 'attachment; filename="login-cards.pdf"',
    });
  }
}
