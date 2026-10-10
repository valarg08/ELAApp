import { createHash } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@storyforge/db';
import type { AiGateway, AnalyzerDef, AnalyzerOutcome } from '@storyforge/ai';
import { DatabaseService } from '../database/database.service.js';

export const AI_GATEWAY = Symbol('AI_GATEWAY');

const CACHE_DAYS = 30;

export interface RunMeta {
  kind: 'live' | 'live-safety' | 'feedback' | 'tutor';
  userId?: string;
  classId?: string;
  /** Extra cache-key input (e.g. the activity key), besides the analyzer, version, model and text. */
  cacheScope: string;
  text: string;
}

/**
 * Runs analyzers through the gateway with the result cache (DESIGN.md §8.8: identical text +
 * analyzer + prompt version → cached 30 days) and records every call in AiUsage.
 * Logs ids, tokens and timing only, never student text.
 */
@Injectable()
export class AiRunnerService {
  private readonly logger = new Logger(AiRunnerService.name);

  constructor(
    @Inject(AI_GATEWAY) readonly gateway: AiGateway,
    private readonly db: DatabaseService,
  ) {}

  async run<I, O>(def: AnalyzerDef<I, O>, input: I, meta: RunMeta): Promise<AnalyzerOutcome<O>> {
    const key = createHash('sha256')
      .update([def.id, def.version, this.gateway.model, meta.cacheScope, meta.text].join('\u0000'))
      .digest('hex');
    const usageBase = {
      kind: meta.kind,
      analyzer: def.id,
      model: this.gateway.model,
      userId: meta.userId ?? null,
      classId: meta.classId ?? null,
    };

    const cached = await this.db.client.aiCache.findUnique({ where: { key } });
    if (cached && cached.expiresAt > new Date()) {
      const parsed = def.schema.safeParse(cached.output);
      if (parsed.success) {
        await this.db.client.aiUsage.create({ data: { ...usageBase, outcome: 'cached' } });
        return {
          status: 'ok',
          result: parsed.data,
          usage: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, latencyMs: 0 },
        };
      }
    }

    let outcome: AnalyzerOutcome<O>;
    try {
      outcome = await this.gateway.run(def, input);
    } catch (error) {
      await this.db.client.aiUsage.create({ data: { ...usageBase, outcome: 'error' } });
      this.logger.warn(
        `${def.id} failed: ${error instanceof Error ? error.constructor.name : 'error'}`,
      );
      throw error;
    }

    await this.db.client.aiUsage.create({
      data: {
        ...usageBase,
        outcome: outcome.status,
        inputTokens: outcome.usage.inputTokens,
        outputTokens: outcome.usage.outputTokens,
        cacheReadTokens: outcome.usage.cacheReadTokens,
        latencyMs: outcome.usage.latencyMs,
      },
    });
    this.logger.log(
      `${def.id} ${outcome.status} model=${this.gateway.model} in=${outcome.usage.inputTokens} out=${outcome.usage.outputTokens} cacheRead=${outcome.usage.cacheReadTokens} ${outcome.usage.latencyMs}ms`,
    );

    if (outcome.status === 'ok') {
      const output: Prisma.InputJsonValue = JSON.parse(JSON.stringify(outcome.result));
      const expiresAt = new Date(Date.now() + CACHE_DAYS * 86_400_000);
      await this.db.client.aiCache.upsert({
        where: { key },
        create: { key, analyzer: def.id, output, expiresAt },
        update: { output, expiresAt, createdAt: new Date() },
      });
    }
    return outcome;
  }
}
