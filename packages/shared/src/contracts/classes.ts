import { z } from 'zod';
import { StudentSecretKind } from '../auth/student-secrets.js';

export const AiFeedbackMode = z.enum(['IMMEDIATE', 'TEACHER_APPROVAL', 'OFF']);

/**
 * Class settings (the `Class.settings` JSON column). Unknown keys are kept.
 * selfPaced: students unlock the next lesson and unit by finishing the previous one, and AI
 * feedback on their writing is shown straight away (unless AI feedback is off).
 */
export const ClassSettings = z.looseObject({
  selfPaced: z.boolean().catch(true).default(true),
});
export type ClassSettings = z.infer<typeof ClassSettings>;
export const classSettings = (value: unknown): ClassSettings =>
  ClassSettings.catch({ selfPaced: true }).parse(value ?? {});

export const CreateClassRequest = z.object({
  name: z.string().trim().min(1).max(80),
  gradeLevel: z.number().int().min(6).max(8),
  timezone: z.string().trim().min(1).max(60).default('UTC'),
});
export type CreateClassRequest = z.infer<typeof CreateClassRequest>;

export const UpdateClassRequest = z
  .object({
    name: z.string().trim().min(1).max(80),
    gradeLevel: z.number().int().min(6).max(8),
    timezone: z.string().trim().min(1).max(60),
    aiFeedbackMode: AiFeedbackMode,
    selfPaced: z.boolean(),
  })
  .partial();
export type UpdateClassRequest = z.infer<typeof UpdateClassRequest>;

export const ClassSummary = z.object({
  id: z.string(),
  name: z.string(),
  gradeLevel: z.number(),
  joinCode: z.string(),
  timezone: z.string(),
  aiFeedbackMode: AiFeedbackMode,
  selfPaced: z.boolean(),
  studentCount: z.number(),
  createdAt: z.iso.datetime(),
});
export type ClassSummary = z.infer<typeof ClassSummary>;

export const MAX_BULK_STUDENTS = 60;

export const BulkAddStudentsRequest = z.object({
  names: z
    .array(z.string().trim().min(1).max(40))
    .min(1, 'Add at least one name')
    .max(MAX_BULK_STUDENTS, `Add at most ${MAX_BULK_STUDENTS} students at a time`),
  secretKind: StudentSecretKind.default('PICTURE'),
});
export type BulkAddStudentsRequest = z.infer<typeof BulkAddStudentsRequest>;

/** Returned once, when a student is created or their secret is reset. Secrets are never stored in plain text. */
export const StudentCredential = z.object({
  id: z.string(),
  displayName: z.string(),
  username: z.string(),
  secretKind: StudentSecretKind,
  secret: z.string(),
});
export type StudentCredential = z.infer<typeof StudentCredential>;

export const StudentSummary = z.object({
  id: z.string(),
  displayName: z.string(),
  username: z.string(),
  secretKind: StudentSecretKind,
  locked: z.boolean(),
  lastLoginAt: z.iso.datetime().nullable(),
});
export type StudentSummary = z.infer<typeof StudentSummary>;

export const ResetSecretRequest = z.object({ secretKind: StudentSecretKind.optional() });
export type ResetSecretRequest = z.infer<typeof ResetSecretRequest>;

export const LoginCardsRequest = z.object({
  cards: z
    .array(z.object({ studentId: z.string().min(1), secret: z.string().min(1).max(60) }))
    .min(1)
    .max(MAX_BULK_STUDENTS),
});
export type LoginCardsRequest = z.infer<typeof LoginCardsRequest>;
