import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import {
  type AiGateway,
  type AiUsageStats,
  type AnalyzerDef,
  type AnalyzerOutcome,
  AnalyzerParseError,
} from './types.js';

export const DEFAULT_MODEL = 'claude-opus-5-5';

/**
 * Claude through the official SDK, server side only (DESIGN.md §8.6): structured outputs with Zod,
 * per-analyzer effort, a cacheable system prompt first and the student text last.
 */
export class ClaudeGateway implements AiGateway {
  readonly provider = 'anthropic' as const;
  private readonly client: Anthropic;

  constructor(
    apiKey: string,
    readonly model: string = DEFAULT_MODEL,
    private readonly timeoutMs = 60_000,
    workspaceId?: string,
  ) {
    // SDK retries (2) cover transient errors; the job queue retries whole jobs on top. A key that
    // isn't scoped to a workspace must name one on every request.
    this.client = new Anthropic({
      apiKey,
      maxRetries: 2,
      timeout: timeoutMs,
      defaultHeaders: workspaceId ? { 'anthropic-workspace-id': workspaceId } : undefined,
    });
  }

  async run<I, O>(def: AnalyzerDef<I, O>, input: I): Promise<AnalyzerOutcome<O>> {
    const started = Date.now();
    const response = await this.client.messages.parse(
      {
        model: this.model,
        max_tokens: def.maxTokens,
        system: [{ type: 'text', text: def.system, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: def.buildUser(input) }],
        output_config: { effort: def.effort, format: zodOutputFormat(def.schema) },
      },
      { timeout: this.timeoutMs },
    );
    const usage: AiUsageStats = {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
      latencyMs: Date.now() - started,
    };
    // Always check for a refusal before reading the content.
    if (response.stop_reason === 'refusal') return { status: 'declined', usage };
    if (!response.parsed_output) throw new AnalyzerParseError(def.id);
    return { status: 'ok', result: response.parsed_output, usage };
  }
}

/** Offline stand-in: each analyzer's `fake()` built from the rule-based checks. Free and instant. */
export class FakeGateway implements AiGateway {
  readonly provider = 'fake' as const;
  readonly model = 'fake';

  async run<I, O>(def: AnalyzerDef<I, O>, input: I): Promise<AnalyzerOutcome<O>> {
    const started = Date.now();
    const result = def.schema.parse(def.fake(input));
    return {
      status: 'ok',
      result,
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        latencyMs: Date.now() - started,
      },
    };
  }
}

export interface GatewayConfig {
  /** "anthropic" or "fake"; defaults to anthropic when a key is set. */
  provider?: string;
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
  /** For an organisation-level API key: the workspace to bill (anthropic-workspace-id). */
  workspaceId?: string;
}

export function createGateway(config: GatewayConfig): AiGateway {
  const provider = config.provider ?? (config.apiKey ? 'anthropic' : 'fake');
  if (provider === 'fake') return new FakeGateway();
  if (provider !== 'anthropic') throw new Error(`Unknown AI_PROVIDER "${provider}"`);
  if (!config.apiKey) throw new Error('AI_PROVIDER=anthropic needs ANTHROPIC_API_KEY');
  return new ClaudeGateway(
    config.apiKey,
    config.model ?? DEFAULT_MODEL,
    config.timeoutMs,
    config.workspaceId,
  );
}
