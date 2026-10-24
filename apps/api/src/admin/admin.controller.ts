import { Body, Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  type AdminAiUsage,
  type AdminAnalytics,
  type AdminContentStatus,
  type AdminLogs,
  type AdminOrg,
  type AdminTeacher,
  ContentSyncRequest,
  type ContentSyncResponse,
  CreateOrgRequest,
  CreateTeacherRequest,
  type TeacherCredential,
  UpdateOrgRequest,
  UpdateTeacherRequest,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { AdminService } from './admin.service.js';
import { LogsService } from './logs.service.js';

@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly logs: LogsService,
  ) {}

  @Get('orgs')
  orgs(): Promise<AdminOrg[]> {
    return this.admin.orgs();
  }

  @Post('orgs')
  createOrg(
    @CurrentUser() user: AuthUser,
    @Body({ schema: CreateOrgRequest }) body: CreateOrgRequest,
  ): Promise<AdminOrg> {
    return this.admin.createOrg(user, body);
  }

  @Patch('orgs/:orgId')
  updateOrg(
    @CurrentUser() user: AuthUser,
    @Param('orgId') orgId: string,
    @Body({ schema: UpdateOrgRequest }) body: UpdateOrgRequest,
  ): Promise<AdminOrg> {
    return this.admin.updateOrg(user, orgId, body);
  }

  @Get('teachers')
  teachers(): Promise<AdminTeacher[]> {
    return this.admin.teachers();
  }

  @Post('teachers')
  createTeacher(
    @CurrentUser() user: AuthUser,
    @Body({ schema: CreateTeacherRequest }) body: CreateTeacherRequest,
  ): Promise<TeacherCredential> {
    return this.admin.createTeacher(user, body);
  }

  @Post('teachers/:teacherId/reset-password')
  @HttpCode(200)
  resetTeacherPassword(
    @CurrentUser() user: AuthUser,
    @Param('teacherId') teacherId: string,
  ): Promise<TeacherCredential> {
    return this.admin.resetTeacherPassword(user, teacherId);
  }

  @Patch('teachers/:teacherId')
  updateTeacher(
    @CurrentUser() user: AuthUser,
    @Param('teacherId') teacherId: string,
    @Body({ schema: UpdateTeacherRequest }) body: UpdateTeacherRequest,
  ): Promise<AdminTeacher> {
    return this.admin.updateTeacher(user, teacherId, body);
  }

  @Get('analytics')
  analytics(): Promise<AdminAnalytics> {
    return this.admin.analytics();
  }

  @Get('ai-usage')
  aiUsage(): Promise<AdminAiUsage> {
    return this.admin.aiUsage();
  }

  @Get('content')
  content(): Promise<AdminContentStatus> {
    return this.admin.contentStatus();
  }

  /** The last 24 hours of the server logs (pm2), newest first. */
  @Get('logs')
  logsToday(): Promise<AdminLogs> {
    return this.logs.recent();
  }

  @Post('content/sync')
  sync(
    @CurrentUser() user: AuthUser,
    @Body({ schema: ContentSyncRequest }) body: ContentSyncRequest,
  ): Promise<ContentSyncResponse> {
    return this.admin.syncContent(user, body.dryRun);
  }
}
