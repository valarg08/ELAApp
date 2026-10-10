import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
  type DiffResponse,
  OpenSubmissionRequest,
  RestoreRequest,
  RevisionRequest,
  SaveDraftRequest,
  type SaveDraftResponse,
  type SubmissionDetail,
  type SubmissionFeedback,
  type SubmitResponse,
  type VersionDetail,
  type VersionSummary,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { SubmissionsService } from './submissions.service.js';

/** Writing workspace API (DESIGN.md §5.4). Reads: owner or class teacher. Writes: owner only. */
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissions: SubmissionsService) {}

  /** Create or return the working copy. */
  @Roles('STUDENT')
  @Post()
  @HttpCode(200)
  open(
    @CurrentUser() user: AuthUser,
    @Body({ schema: OpenSubmissionRequest }) body: OpenSubmissionRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.open(user, body);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<SubmissionDetail> {
    return this.submissions.get(user, id);
  }

  /** AI feedback: what the student may see, plus scores and status for the class teacher. */
  @Get(':id/feedback')
  feedback(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<SubmissionFeedback> {
    return this.submissions.getFeedback(user, id);
  }

  @Roles('STUDENT')
  @Patch(':id/draft')
  saveDraft(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SaveDraftRequest }) body: SaveDraftRequest,
  ): Promise<SaveDraftResponse> {
    return this.submissions.saveDraft(user, id, body);
  }

  @Roles('STUDENT')
  @Post(':id/submit')
  @HttpCode(200)
  submit(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: RevisionRequest }) body: RevisionRequest,
  ): Promise<SubmitResponse> {
    return this.submissions.submit(user, id, body.baseRevision);
  }

  @Get(':id/versions')
  versions(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<VersionSummary[]> {
    return this.submissions.listVersions(user, id);
  }

  /** "Save version" button. */
  @Roles('STUDENT')
  @Post(':id/versions')
  saveVersion(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: RevisionRequest }) body: RevisionRequest,
  ): Promise<VersionSummary> {
    return this.submissions.saveVersion(user, id, body.baseRevision);
  }

  @Get(':id/versions/:versionId')
  version(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Param('versionId') versionId: string,
  ): Promise<VersionDetail> {
    return this.submissions.getVersion(user, id, versionId);
  }

  @Roles('STUDENT')
  @Post(':id/restore')
  @HttpCode(200)
  restore(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: RestoreRequest }) body: RestoreRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.restore(user, id, body);
  }

  /** `?from=<versionId>&to=<versionId>`; without `to`, compares with the current draft. */
  @Get(':id/diff')
  diff(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query('from') from = '',
    @Query('to') to?: string,
  ): Promise<DiffResponse> {
    return this.submissions.diff(user, id, from, to || undefined);
  }
}
