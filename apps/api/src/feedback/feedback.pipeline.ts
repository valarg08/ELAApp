import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@storyforge/db';
import {
  type FeedbackPoint,
  LIVE_ANALYZERS,
  WANT_FEAR_TYPES,
  type WritingContext,
  analyzersForActivity,
  characterReadPoints,
  settingMoodPoints,
  plotCheckPoints,
  povPoints,
  tonePoints,
  figurativePoints,
  poetryPoints,
  grammarPoints,
  paragraphPoints,
  essayPoints,
  rubricForActivity,
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
  GRAMMAR_ACTIVITY_TYPES,
  PARAGRAPH_ACTIVITY_TYPES,
  ESSAY_ACTIVITY_TYPES,
  POETRY_ACTIVITY_TYPES,
  SENSORY_ACTIVITY_TYPES,
  submissionChoices,
} from '@storyforge/shared';
import {
  dialogue,
  filterWords,
  essayNotes,
  essayStructure,
  grammarIssues,
  paragraphNotes,
  paragraphRoles,
  passiveNotes,
  quotes,
  reportedClauses,
  SENTENCE_TYPES,
  sentenceTypes,
  varietyNotes,
  veryPhrases,
  senses,
  sentenceVariety,
  telling,
  wordStats,
} from '@storyforge/writing-analysis';
import { AiRunnerService } from '../ai/ai-runner.service.js';
import { DatabaseService } from '../database/database.service.js';
import { SafetyService } from '../safety/safety.service.js';
import { plotInput, plotScope } from '../ai/plot-input.js';
import { povInput, toneInput, toneScope } from '../ai/voice-input.js';
import { poemInput, poemScope } from '../ai/poem-input.js';
import { grammarInput } from '../ai/grammar-input.js';
import { paragraphInput } from '../ai/paragraph-input.js';
import { essayInput } from '../ai/essay-input.js';

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
  mood: 'setting mood',
  pacing: 'pacing',
  tone: 'tone and voice',
  figurative: 'figurative language',
  syllables: 'syllables and form',
  lineBreaks: 'line breaks',
  sound: 'sound devices',
  nouns: 'nouns',
  pronouns: 'pronouns',
  verbs: 'verbs',
  modifiers: 'adjectives and adverbs',
  connectors: 'prepositions and conjunctions',
  voice: 'active and passive voice',
  speech: 'direct and reported speech',
  structure: 'sentence structure',
  punctuation: 'capitals and punctuation',
  sentenceTypes: 'sentence types and variety',
  paragraphs: 'paragraph structure (topic sentence, evidence, explanation, transitions, closing)',
  essay:
    'essay structure (hook, thesis, body paragraphs that support it, counterclaim and rebuttal, conclusion)',
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
    const typed = sentenceTypes(text);
    const roles = paragraphRoles(text);
    const essayOptions = { ...content.essay, counterclaim: essayInput(content).counterclaim };
    const essay = essayStructure(text, essayOptions);
    const evidence = [
      `${stats.words} words, ${stats.sentences} sentences, ${stats.paragraphs} paragraphs`,
      `sentence lengths: ${variety.short} short, ${variety.medium} medium, ${variety.long} long`,
      `telling phrases found: ${telling(text).phrases.length}`,
      `filter words: ${filterWords(text).total}`,
      `senses used: ${senses(text).used.join(', ') || 'none'}`,
      `dialogue punctuation issues: ${dialogue(text).issues.length}`,
      `grammar mistakes found (nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, passive forms, speech, fragments, run-ons, comma splices, capitals and punctuation): ${grammarIssues(text).length}`,
      `weak “very” phrases: ${veryPhrases(text).length}`,
      `passive verbs: ${passiveNotes(text).length}`,
      `quotes: ${quotes(text).length}, reported speech: ${reportedClauses(text).length}`,
      `sentence types: ${SENTENCE_TYPES.map((t) => `${typed.filter((s) => s.type === t).length} ${t}`).join(', ')}; variety notes (stringy, choppy, too long, same opener): ${varietyNotes(text).length}`,
      `paragraph parts: ${['topic', 'evidence', 'explanation', 'closing'].map((r) => `${roles.filter((s) => s.role === r).length} ${r}`).join(', ')}; transitions: ${roles.filter((s) => s.transition).length}; paragraph notes (no topic sentence, no evidence, unexplained evidence, no closing, no transitions): ${paragraphNotes(text).length}`,
      `essay parts: ${essay.outline ? 'outline' : 'essay'}; ${essay.paragraphs.filter((p) => p.part === 'body').length} body; thesis ${essay.thesis?.kind ?? 'none'}; counterclaims ${essay.paragraphs.filter((p) => p.counterclaim).length}; essay notes (thesis, hook, body links, counterclaim, conclusion): ${essayNotes(text, essayOptions).length}`,
    ];

    // 3. LLM analyzers for this activity type.
    const analyzerOutputs: Record<string, unknown> = {};
    const notes: string[] = [];
    const extraStrengths: FeedbackPoint[] = [];
    const extraNextSteps: FeedbackPoint[] = [];
    // The unit's own check ("Can your reader tell?", "What mood…") is the point of the activity, so its points come first.
    const focusStrengths: FeedbackPoint[] = [];
    const focusNextSteps: FeedbackPoint[] = [];
    let declined = false;
    const versions: string[] = [];
    const runMeta = { ...meta, cacheScope: activity.key, text };
    const {
      traits,
      mood: moods,
      conflict,
      plot,
      tone,
      syllables,
    } = submissionChoices(submission.choices);
    const checkWantFear = WANT_FEAR_TYPES.includes(content.type);
    const collect = (p: { strengths: FeedbackPoint[]; nextSteps: FeedbackPoint[] }) => {
      extraStrengths.push(...p.strengths);
      extraNextSteps.push(...p.nextSteps);
    };
    for (const id of analyzersForActivity(content.type, content.essay?.part)) {
      versions.push(LIVE_ANALYZERS[id].version);
      if (id === 'show-vs-tell') {
        const outcome = await this.ai.run(LIVE_ANALYZERS[id], ctx, runMeta);
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        notes.push(
          `show-vs-tell: ${r.tellingSentences.length} telling places, show ratio ${r.showRatio.toFixed(2)}`,
        );
        collect(showVsTellPoints(text, r));
      } else if (id === 'sensory-analysis') {
        const outcome = await this.ai.run(LIVE_ANALYZERS[id], ctx, runMeta);
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        notes.push(`sensory: missing ${r.missing.join(', ') || 'none'}`);
        // In the sensory units the senses are the point of the activity.
        const p = sensoryPoints(text, r);
        if (SENSORY_ACTIVITY_TYPES.includes(content.type)) {
          focusStrengths.push(...p.strengths);
          focusNextSteps.push(...p.nextSteps);
        } else {
          collect(p);
        }
      } else if (id === 'plot-check') {
        const extra = plotInput(content, conflict, plot);
        const outcome = await this.ai.run(
          LIVE_ANALYZERS[id],
          { ...ctx, ...extra },
          { ...runMeta, cacheScope: `${activity.key}|${plotScope(extra)}` },
        );
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        const missing = r.stages.filter((s) => !s.present).map((s) => s.stage);
        notes.push(
          `plot: conflict ${r.conflict.clear ? 'clear' : 'unclear'}${extra.conflict ? ` (chosen ${extra.conflict.label}, ${r.conflict.matchesChosen ? 'matches' : 'does not match'})` : ''}; missing stages ${missing.join(', ') || 'none'}; climax ${r.climax.clear ? 'clear' : 'unclear'}; ending ${r.ending.resolved ? 'resolved' : 'open'}`,
        );
        const p = plotCheckPoints(text, r, extra.conflict?.label ?? null);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else if (id === 'pov-consistency') {
        const extra = povInput(content);
        const outcome = await this.ai.run(LIVE_ANALYZERS[id], { ...ctx, ...extra }, runMeta);
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        const broken = r.parts.filter((p) => !p.keeps).map((p) => p.label);
        notes.push(
          `point of view: ${r.detectedPov}, ${r.shifts.length} shifts${r.narrator ? `; narrator ${r.narrator.detected} (target ${extra.narrator})` : ''}${r.parts.length > 0 ? `; parts that slip: ${broken.join(', ') || 'none'}` : ''}`,
        );
        const p = povPoints(text, r, extra.narrator);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else if (id === 'poetry-craft') {
        const extra = poemInput(content, syllables);
        const outcome = await this.ai.run(
          LIVE_ANALYZERS[id],
          { ...ctx, ...extra },
          { ...runMeta, cacheScope: `${activity.key}|${poemScope(extra)}` },
        );
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        notes.push(
          `poem (${extra.form}): form ${r.form.fits ? 'fits' : 'does not fit'}; sound ${r.sound.map((x) => x.device).join(', ') || 'none'}`,
        );
        const p = poetryPoints(text, r);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else if (id === 'grammar-check') {
        const extra = grammarInput(content);
        const outcome = await this.ai.run(LIVE_ANALYZERS[id], { ...ctx, ...extra }, runMeta);
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        notes.push(
          `grammar: ${r.errors.length} mistakes; lesson skill ${r.focus.used ? 'used' : 'missing'}${r.tasks.length > 0 ? `; tasks done ${r.tasks.filter((t) => t.done).length}/${r.tasks.length}` : ''}`,
        );
        const p = grammarPoints(text, r);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else if (id === 'paragraph-structure') {
        const extra = paragraphInput(content);
        const outcome = await this.ai.run(LIVE_ANALYZERS[id], { ...ctx, ...extra }, runMeta);
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        notes.push(
          `paragraph: topic ${r.topic.present ? 'clear' : 'missing'}; evidence ${r.evidence.length} (${r.evidence.filter((e) => e.explained).length} explained); transitions ${r.transitions.quotes.length}; closing ${r.closing.present ? 'present' : 'missing'}; ${r.unity.focused ? 'focused' : 'wanders'}`,
        );
        const p = paragraphPoints(text, r);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else if (id === 'essay-structure') {
        const extra = essayInput(content);
        const outcome = await this.ai.run(LIVE_ANALYZERS[id], { ...ctx, ...extra }, runMeta);
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        notes.push(
          `essay: thesis ${r.thesis.kind}; hook ${r.hook.works ? 'works' : 'weak'}; bodies ${r.bodies.length} (${r.bodies.filter((b) => b.supportsThesis).length} support the thesis); counterclaim ${r.counterclaim.present ? (r.counterclaim.rebutted ? 'answered' : 'unanswered') : 'none'}; conclusion ${r.conclusion.present ? `${r.conclusion.restates ? 'restates' : 'no restatement'}, ${r.conclusion.finalThought ? 'final thought' : 'no final thought'}` : 'missing'}`,
        );
        const p = essayPoints(text, r, extra.mode);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else if (id === 'figurative-language') {
        const goals = content.figurativeHelper?.devices ?? [];
        const outcome = await this.ai.run(LIVE_ANALYZERS[id], { ...ctx, goals }, runMeta);
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        notes.push(
          `figurative: ${r.devices.map((d) => d.type).join(', ') || 'none found'}${
            goals.length > 0
              ? `; goals missing: ${
                  r.goals
                    .filter((g) => !g.found)
                    .map((g) => g.device)
                    .join(', ') || 'none'
                }`
              : ''
          }`,
        );
        const p = figurativePoints(text, r);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else if (id === 'tone-style') {
        const extra = toneInput(content, tone);
        const outcome = await this.ai.run(
          LIVE_ANALYZERS[id],
          { ...ctx, ...extra },
          { ...runMeta, cacheScope: `${activity.key}|${toneScope(extra)}` },
        );
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        notes.push(
          `tone: ${r.tones.map((t) => `${t.axis} aimed ${t.aimed ?? '-'} heard ${t.heard}`).join('; ')}; voice ${r.voice.words.join(', ') || 'unclear'}`,
        );
        const p = tonePoints(text, r);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else if (id === 'setting-mood') {
        const outcome = await this.ai.run(
          LIVE_ANALYZERS[id],
          { ...ctx, targetMoods: moods },
          { ...runMeta, cacheScope: `${activity.key}|${moods.join(',')}` },
        );
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        const felt = r.targets.filter((t) => t.felt).map((t) => t.mood);
        notes.push(
          `setting: chosen moods ${moods.join(', ') || 'none'}; a reader feels ${r.overallMood} (${felt.join(', ') || 'none of the chosen'}); time ${r.time.clear ? 'clear' : 'unclear'}, place ${r.place.clear ? 'clear' : 'unclear'}`,
        );
        const p = settingMoodPoints(text, r);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      } else {
        const outcome = await this.ai.run(
          LIVE_ANALYZERS[id],
          { ...ctx, targetTraits: traits, checkWantFear },
          { ...runMeta, cacheScope: `${activity.key}|${traits.join(',')}` },
        );
        if (outcome.status === 'declined') {
          declined = true;
          continue;
        }
        const r = outcome.result;
        analyzerOutputs[id] = r;
        const shown = r.targets.filter((t) => t.inferred).map((t) => t.trait);
        notes.push(
          `character: chosen traits ${traits.join(', ') || 'none'}; a reader can tell ${shown.join(', ') || 'none'}; want ${r.want.clear ? 'clear' : 'unclear'}, fear ${r.fear.clear ? 'clear' : 'unclear'}`,
        );
        const p = characterReadPoints(text, r, checkWantFear);
        focusStrengths.push(...p.strengths);
        focusNextSteps.push(...p.nextSteps);
      }
    }

    // 4–5. Rubric score + composition.
    const rubric = rubricForActivity(content.type, content.essay?.part, content.essay?.type);
    versions.push(rubricScoreAnalyzer.version);
    if (POETRY_ACTIVITY_TYPES.includes(content.type)) {
      notes.push(
        'this is a poem: line breaks are deliberate; judge rhythm and line breaks instead of sentences',
      );
    }
    const rubricInput = {
      ...ctx,
      rubric,
      evidence,
      analyzerNotes: notes,
      ...(content.essay ? { essay: essayOptions } : {}),
    };
    const scored = await this.ai.run(rubricScoreAnalyzer, rubricInput, {
      ...meta,
      cacheScope: `${activity.key}|${rubric.key}`,
      text,
    });
    const rubricRow = await this.db.client.rubric.upsert({
      where: { key: rubric.key },
      create: {
        key: rubric.key,
        name: rubric.name,
        criteria: toJson(rubric.criteria),
        maxScore: rubric.maxScore,
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
    const scores: CriterionScore[] = rubric.criteria.flatMap((c) => {
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
      scores.length < rubric.criteria.length ||
      scores.some((s) => s.confidence < 0.6) ||
      (levels.grammar === 4 && dialogueIssues >= 5);

    const composed = rubricPoints(text, r);
    // The rubric's next steps are about prose craft; poems and grammar practice get their own check's.
    const ownSteps =
      POETRY_ACTIVITY_TYPES.includes(content.type) ||
      GRAMMAR_ACTIVITY_TYPES.includes(content.type) ||
      PARAGRAPH_ACTIVITY_TYPES.includes(content.type) ||
      ESSAY_ACTIVITY_TYPES.includes(content.type);
    const strengths = dedupe([
      ...focusStrengths.slice(0, 3),
      ...composed.strengths,
      ...extraStrengths,
    ]).slice(0, focusStrengths.length > 1 ? 3 : 2);
    const nextSteps = dedupe([
      ...focusNextSteps.slice(0, 2),
      ...(ownSteps ? [] : composed.nextSteps),
      ...extraNextSteps,
    ]).slice(0, 3);

    await this.db.client.feedback.update({
      where: { id: feedbackId },
      data: {
        status: immediate ? 'READY' : 'PENDING_REVIEW',
        model,
        promptVersion: versions.join(','),
        rubricId: rubricRow.id,
        scores: toJson(scores),
        totalScore: totalScore(rubric, levels),
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
