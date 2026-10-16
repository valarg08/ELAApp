import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put, Query } from '@nestjs/common';
import {
  type DiffResponse,
  OpenSubmissionRequest,
  RestoreRequest,
  RevisionRequest,
  SaveDraftRequest,
  SetConflictRequest,
  SetMoodRequest,
  SetOutlineRequest,
  SetParagraphRequest,
  SetPlotRequest,
  SetSyllablesRequest,
  SetToneRequest,
  SetTraitsRequest,
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

  /** The traits picked for the activity's trait picker (Unit 2). */
  @Roles('STUDENT')
  @Put(':id/traits')
  setTraits(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SetTraitsRequest }) body: SetTraitsRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.setTraits(user, id, body.traits);
  }

  /** The moods chosen for the activity's mood picker (Unit 3). */
  @Roles('STUDENT')
  @Put(':id/mood')
  setMood(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SetMoodRequest }) body: SetMoodRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.setMood(user, id, body.mood);
  }

  /** The conflict card chosen for the activity's conflict picker (Unit 4). */
  @Roles('STUDENT')
  @Put(':id/conflict')
  setConflict(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SetConflictRequest }) body: SetConflictRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.setConflict(user, id, body.conflict);
  }

  /** The story mountain plan for the activity's plot planner (Unit 4). */
  @Roles('STUDENT')
  @Put(':id/plot')
  setPlot(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SetPlotRequest }) body: SetPlotRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.setPlot(user, id, body.plot);
  }

  /** The paragraph builder's boxes (Essay Unit 10). */
  @Roles('STUDENT')
  @Put(':id/paragraph')
  setParagraph(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SetParagraphRequest }) body: SetParagraphRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.setParagraph(user, id, body.paragraph);
  }

  /** The outline builder's boxes (Essay Unit 11 on). */
  @Roles('STUDENT')
  @Put(':id/outline')
  setOutline(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SetOutlineRequest }) body: SetOutlineRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.setOutline(user, id, body.outline);
  }

  /** The student's own syllable counts for words in their poem (Unit 7). */
  @Roles('STUDENT')
  @Put(':id/syllables')
  setSyllables(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SetSyllablesRequest }) body: SetSyllablesRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.setSyllables(user, id, body.overrides);
  }

  /** The tone aimed for on the activity's tone sliders (Unit 5). */
  @Roles('STUDENT')
  @Put(':id/tone')
  setTone(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body({ schema: SetToneRequest }) body: SetToneRequest,
  ): Promise<SubmissionDetail> {
    return this.submissions.setTone(user, id, body.tone);
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
