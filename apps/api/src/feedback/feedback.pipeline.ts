import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@storyforge/db';
import {
  DEFAULT_RUBRIC,
  type FeedbackPoint,
  LIVE_ANALYZERS,
  type WritingContext,
  analyzersForActivity,
  rubricPoints,
  rubricScoreAnalyzer,
  sensoryPoints,
  showVsTellPoints,
  totalScore,
} from '@storyforge/ai';
import {
  ActivityContent,
  type CriterionScore,
  classSettings,
  FeedbackPoint as FeedbackPointSchema,
  isWritingActivity,
} from '@storyforge/shared';
import {
  dialogue,
  filterWords,
  senses,
  sentenceVariety,
  telling,
  wordStats,
} from '@storyforge/writing-analysis';
import { AiRunnerService } from '../ai/ai-runner.service.js';
import { DatabaseService } from '../database/database.service.js';
import { SafetyService } from '../safety/safety.service.js';

const toJson = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value));
const points = (list: FeedbackPoint[]) => FeedbackPointSchema.array().parse(list);

/** Readable names for the coach checks, used as "focus skills" in prompts. */
const SKILL_NAMES: Record<string, string> = {
  telling: 'show, don’t tell',
  filterWords: 'precise word choice',
  senses: 'sensory detail',
  sentenceVariety: 'sentence variety',
  dialogue: 'dialogue',
  pov: 'point of view',
  tense: 'consistent tense',
};

/**
 * The ai-feedback job (DESIGN.md §8.2): safety → deterministic analyzers → LLM analyzers →
 * rubric score + composition → anchor → store. Idempotent: only QUEUED feedback is processed.
 */
@Injectable()
export class FeedbackPipeline {
  private readonly logger = new Logger(FeedbackPipeline.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly ai: AiRunnerService,
    private readonly safety: SafetyService,
  ) {}

  async run(feedbackId: string): Promise<void> {
    const feedback = await this.db.client.feedback.findUnique({
      where: { id: feedbackId },
      include: { submission: { include: { activity: { include: { unit: true } } } } },
    });
    if (!feedback || feedback.status !== 'QUEUED') return;
    const { submission } = feedback;
    const { activity } = submission;
    const content = ActivityContent.parse(activity.config);
    if (!isWritingActivity(content)) throw new Error(`Activity ${activity.key} is not writing`);
    const klass = await this.db.client.class.findUniqueOrThrow({
      where: { id: submission.classId },
    });
    // Self-paced classes get feedback straight away (OFF classes never get here).
    const immediate =
      klass.aiFeedbackMode === 'IMMEDIATE' || classSettings(klass.settings).selfPaced;

    // The text as submitted (the draft may have moved on since).
    const snapshot = await this.db.client.draftVersion.findFirst({
      where: { submissionId: submission.id, version: feedback.submissionVersion, reason: 'SUBMIT' },
      orderBy: { createdAt: 'desc' },
    });
    const text = snapshot?.contentText ?? submission.contentText;
    const ctx: WritingContext = {
      text,
      activityTitle: content.title,
      prompt: content.prompt,
      unitTitle: activity.unit.title,
      focusSkills: (content.analyzers ?? []).map((a) => SKILL_NAMES[a] ?? a),
      gradeLevel: klass.gradeLevel,
    };
    const meta = { kind: 'feedback' as const, userId: submission.studentId, classId: klass.id };
    const model = this.ai.gateway.model;

    // 1. Safety first: a hold means no AI commentary reaches the student.
    const screen = await this.safety.screen(ctx, {
      studentId: submission.studentId,
      classId: klass.id,
      submissionId: submission.id,
      live: false,
    });
    if (screen.hold) {
      await this.db.client.feedback.update({
        where: { id: feedbackId },
        data: {
          status: 'PENDING_REVIEW',
          model,
          analyzers: toJson({ safetyHold: true, declined: screen.declined }),
        },
      });
      this.logger.log(`Feedback ${feedbackId} held for the teacher (safety)`);
      return;
    }

    // 2. Deterministic analyzers: counts only go into the prompt.
    const stats = wordStats(text);
    const variety = sentenceVariety(text);
    const evidence = [
      `${stats.words} words, ${stats.sentences} sentences, ${stats.paragraphs} paragraphs`,
      `sentence lengths: ${variety.short} short, ${variety.medium} medium, ${variety.long} long`,
      `telling phrases found: ${telling(text).phrases.length}`,
      `filter words: ${filterWords(text).total}`,
      `senses used: ${senses(text).used.join(', ') || 'none'}`,
      `dialogue punctuation issues: ${dialogue(text).issues.length}`,
    ];

    // 3. LLM analyzers for this activity type.
    const analyzerOutputs: Record<string, unknown> = {};
    const notes: string[] = [];
    const extraStrengths: FeedbackPoint[] = [];
    const extraNextSteps: FeedbackPoint[] = [];
    let declined = false;
    const versions: string[] = [];
    for (const id of analyzersForActivity(content.type)) {
      const def = LIVE_ANALYZERS[id];
      versions.push(def.version);
      const outcome =
        id === 'show-vs-tell'
          ? await this.ai.run(LIVE_ANALYZERS['show-vs-tell'], ctx, {
              ...meta,
              cacheScope: activity.key,
              text,
            })
          : await this.ai.run(LIVE_ANALYZERS['sensory-analysis'], ctx, {
              ...meta,
              cacheScope: activity.key,
              text,
            });
      if (outcome.status === 'declined') {
        declined = true;
        continue;
      }
      analyzerOutputs[id] = outcome.result;
      if ('tellingSentences' in outcome.result) {
        const r = outcome.result;
        notes.push(
          `show-vs-tell: ${r.tellingSentences.length} telling places, show ratio ${r.showRatio.toFixed(2)}`,
        );
        const p = showVsTellPoints(text, r);
        extraStrengths.push(...p.strengths);
        extraNextSteps.push(...p.nextSteps);
      } else {
        const r = outcome.result;
        notes.push(`sensory: missing ${r.missing.join(', ') || 'none'}`);
        const p = sensoryPoints(text, r);
        extraStrengths.push(...p.strengths);
        extraNextSteps.push(...p.nextSteps);
      }
    }

    // 4–5. Rubric score + composition.
    versions.push(rubricScoreAnalyzer.version);
    const rubricInput = { ...ctx, rubric: DEFAULT_RUBRIC, evidence, analyzerNotes: notes };
    const scored = await this.ai.run(rubricScoreAnalyzer, rubricInput, {
      ...meta,
      cacheScope: `${activity.key}|${DEFAULT_RUBRIC.key}`,
      text,
    });
    const rubricRow = await this.db.client.rubric.upsert({
      where: { key: DEFAULT_RUBRIC.key },
      create: {
        key: DEFAULT_RUBRIC.key,
        name: DEFAULT_RUBRIC.name,
        criteria: toJson(DEFAULT_RUBRIC.criteria),
        maxScore: DEFAULT_RUBRIC.maxScore,
      },
      update: {},
    });

    if (scored.status === 'declined' || declined) {
      await this.db.client.feedback.update({
        where: { id: feedbackId },
        data: {
          status: 'PENDING_REVIEW',
          model,
          promptVersion: versions.join(','),
          rubricId: rubricRow.id,
          analyzers: toJson({ ...analyzerOutputs, declined: true }),
        },
      });
      return;
    }

    const r = scored.result;
    const scores: CriterionScore[] = DEFAULT_RUBRIC.criteria.flatMap((c) => {
      const found = r.criteria.find((x) => x.key === c.key);
      if (!found) return [];
      return [
        {
          key: c.key,
          label: c.label,
          level: Math.max(1, Math.min(4, Math.round(found.level))),
          rationale: found.rationale,
          confidence: Math.max(0, Math.min(1, found.confidence)),
          evidenceQuotes: found.evidenceQuotes.slice(0, 2),
        },
      ];
    });
    const levels = Object.fromEntries(scores.map((s) => [s.key, s.level]));
    const dialogueIssues = dialogue(text).issues.length;
    const needsTeacherAttention =
      scores.length < DEFAULT_RUBRIC.criteria.length ||
      scores.some((s) => s.confidence < 0.6) ||
      (levels.grammar === 4 && dialogueIssues >= 5);

    const composed = rubricPoints(text, r);
    const strengths = dedupe([...composed.strengths, ...extraStrengths]).slice(0, 2);
    const nextSteps = dedupe([...composed.nextSteps, ...extraNextSteps]).slice(0, 3);

    await this.db.client.feedback.update({
      where: { id: feedbackId },
      data: {
        status: immediate ? 'READY' : 'PENDING_REVIEW',
        model,
        promptVersion: versions.join(','),
        rubricId: rubricRow.id,
        scores: toJson(scores),
        totalScore: totalScore(DEFAULT_RUBRIC, levels),
        summary: r.summary,
        strengths: toJson(points(strengths)),
        nextSteps: toJson(points(nextSteps)),
        analyzers: toJson({
          ...analyzerOutputs,
          needsTeacherAttention,
          personalInfo: screen.personalInfo,
        }),
        ...(immediate ? { releasedAt: new Date() } : {}),
      },
    });
    this.logger.log(
      `Feedback ${feedbackId} ready (${immediate ? 'shown now' : 'waiting for teacher'})`,
    );
  }
}

/** One point per quoted passage. */
function dedupe(list: FeedbackPoint[]): FeedbackPoint[] {
  const seen = new Set<string>();
  return list.filter((p) => {
    const key = p.start !== undefined ? `${p.start}` : p.message;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
