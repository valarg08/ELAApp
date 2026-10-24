import { z } from 'zod';

/**
 * Admin console (DESIGN.md §11.9): schools, teachers, curriculum, platform analytics and AI
 * usage. Admins see counts and token totals only, never student text.
 */

/** US dollars per million tokens (input, output, cache read) for the models the app calls. */
export const MODEL_PRICES: Record<string, { input: number; output: number; cacheRead: number }> = {
  'claude-opus-5-5': { input: 4, output: 20, cacheRead: 0.2 },
  'claude-sonnet-5-5': { input: 2, output: 10, cacheRead: 0.2 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5, cacheRead: 0.01 },
};

/** Estimated cost in US cents; unknown models (and the fake gateway) are priced like Opus 5.5. */
export function estimateCostCents(
  model: string,
  tokens: { inputTokens: number; outputTokens: number; cacheReadTokens: number },
): number {
  const p = MODEL_PRICES[model] ?? MODEL_PRICES['claude-opus-5-5']!;
  const dollars =
    (tokens.inputTokens * p.input +
      tokens.outputTokens * p.output +
      tokens.cacheReadTokens * p.cacheRead) /
    1_000_000;
  return dollars * 100;
}

export const AdminOrg = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string().nullable(),
  timezone: z.string(),
  /** Daily cap on estimated AI spend in US cents; null means no cap. */
  aiDailyBudgetCents: z.number().int().nullable(),
  teachers: z.number().int(),
  classes: z.number().int(),
  students: z.number().int(),
  /** Estimated AI spend so far today (UTC), in cents. */
  aiCostTodayCents: z.number(),
  createdAt: z.string(),
});
export type AdminOrg = z.infer<typeof AdminOrg>;

const budget = z.number().int().min(0).max(1_000_000).nullable();

export const CreateOrgRequest = z.object({
  name: z.string().trim().min(2).max(120),
  country: z.string().trim().max(60).optional(),
  timezone: z.string().trim().min(1).max(60).default('UTC'),
  aiDailyBudgetCents: budget.optional(),
});
export type CreateOrgRequest = z.infer<typeof CreateOrgRequest>;

export const UpdateOrgRequest = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  aiDailyBudgetCents: budget.optional(),
});
export type UpdateOrgRequest = z.infer<typeof UpdateOrgRequest>;

export const AdminTeacher = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().nullable(),
  orgId: z.string().nullable(),
  orgName: z.string().nullable(),
  classes: z.number().int(),
  students: z.number().int(),
  lastLoginAt: z.string().nullable(),
  active: z.boolean(),
});
export type AdminTeacher = z.infer<typeof AdminTeacher>;

export const UpdateTeacherRequest = z.object({
  orgId: z.string().min(1).nullable().optional(),
  active: z.boolean().optional(),
});
export type UpdateTeacherRequest = z.infer<typeof UpdateTeacherRequest>;

/** The admin creates teacher accounts when teacher sign-up is closed (public sites). */
export const CreateTeacherRequest = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email('Enter a valid email address')),
  displayName: z.string().trim().min(1).max(60),
  orgId: z.string().min(1).nullable().optional(),
});
export type CreateTeacherRequest = z.infer<typeof CreateTeacherRequest>;

/** Returned once, when a teacher is created or their password is reset; only a hash is stored. */
export const TeacherCredential = z.object({ teacher: AdminTeacher, password: z.string() });
export type TeacherCredential = z.infer<typeof TeacherCredential>;

export const AdminAnalytics = z.object({
  totals: z.object({
    schools: z.number().int(),
    teachers: z.number().int(),
    classes: z.number().int(),
    students: z.number().int(),
    submissions: z.number().int(),
  }),
  /** The last 14 days (UTC), oldest first. */
  days: z.array(
    z.object({
      day: z.string(),
      activeStudents: z.number().int(),
      submissions: z.number().int(),
      lessonsCompleted: z.number().int(),
    }),
  ),
});
export type AdminAnalytics = z.infer<typeof AdminAnalytics>;

const tokenTotals = {
  calls: z.number().int(),
  inputTokens: z.number().int(),
  outputTokens: z.number().int(),
  cacheReadTokens: z.number().int(),
  costCents: z.number(),
};

export const AdminAiUsage = z.object({
  /** The last 14 days (UTC), oldest first. */
  days: z.array(z.object({ day: z.string(), ...tokenTotals })),
  /** The same 14 days by kind (live, live-safety, feedback, tutor) and analyzer, costliest first. */
  byAnalyzer: z.array(z.object({ kind: z.string(), analyzer: z.string(), ...tokenTotals })),
  /** Today's spend per school against its budget. */
  orgsToday: z.array(
    z.object({
      orgId: z.string(),
      name: z.string(),
      costCents: z.number(),
      aiDailyBudgetCents: z.number().int().nullable(),
    }),
  ),
});
export type AdminAiUsage = z.infer<typeof AdminAiUsage>;

export const AdminContentStatus = z.object({
  units: z.array(
    z.object({
      track: z.string(),
      number: z.number().int(),
      title: z.string(),
      published: z.boolean(),
      /** in-sync: the database matches /content; changed: /content differs; new: not loaded yet. */
      state: z.enum(['in-sync', 'changed', 'new']),
    }),
  ),
  errors: z.array(z.string()),
});
export type AdminContentStatus = z.infer<typeof AdminContentStatus>;

export const ContentSyncRequest = z.object({ dryRun: z.boolean().default(true) });
export type ContentSyncRequest = z.infer<typeof ContentSyncRequest>;

export const ContentSyncResponse = z.object({
  dryRun: z.boolean(),
  units: z.number().int(),
  lessons: z.number().int(),
  activities: z.number().int(),
  orphans: z.array(z.string()),
  errors: z.array(z.string()),
});
export type ContentSyncResponse = z.infer<typeof ContentSyncResponse>;

/** One line (or a multi-line message, like a stack trace) from the server logs (DESIGN.md §11.9). */
export const AdminLogEntry = z.object({
  time: z.iso.datetime({ offset: true }),
  /** The pm2 process without its prefix: api, worker, web or tunnel. */
  source: z.string(),
  level: z.enum(['error', 'warn', 'info']),
  text: z.string(),
});
export type AdminLogEntry = z.infer<typeof AdminLogEntry>;

export const AdminLogs = z.object({
  /** False when the API has no LOG_DIR (development, or not run by pm2). */
  available: z.boolean(),
  hours: z.number().int(),
  /** Newest first. */
  entries: z.array(AdminLogEntry),
  /** More than the page shows: only the newest entries are listed. */
  truncated: z.boolean(),
});
export type AdminLogs = z.infer<typeof AdminLogs>;
