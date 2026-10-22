import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  type AdminAiUsage,
  type AdminAnalytics,
  type AdminContentStatus,
  type AdminOrg,
  type AdminTeacher,
  ContentSyncRequest,
  type ContentSyncResponse,
  CreateOrgRequest,
  UpdateOrgRequest,
  UpdateTeacherRequest,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { AdminService } from './admin.service.js';

@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

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

  @Post('content/sync')
  sync(
    @CurrentUser() user: AuthUser,
    @Body({ schema: ContentSyncRequest }) body: ContentSyncRequest,
  ): Promise<ContentSyncResponse> {
    return this.admin.syncContent(user, body.dryRun);
  }
}
