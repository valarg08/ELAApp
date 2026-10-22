import { z } from 'zod';
import { StudentSecretKind } from '../auth/student-secrets.js';

export const Role = z.enum(['STUDENT', 'TEACHER', 'ADMIN']);
export type Role = z.infer<typeof Role>;

/** Six characters without look-alikes (no 0/O, 1/I). */
export const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const JoinCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-HJ-NP-Z2-9]{6}$/, 'Class codes are 6 letters and numbers');

export const RegisterTeacherRequest = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email('Enter a valid email address')),
  password: z.string().min(10, 'Use at least 10 characters').max(128),
  displayName: z.string().trim().min(1).max(60),
});
export type RegisterTeacherRequest = z.infer<typeof RegisterTeacherRequest>;

export const LoginRequest = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email('Enter a valid email address')),
  password: z.string().min(1).max(128),
});
export type LoginRequest = z.infer<typeof LoginRequest>;

export const StudentLookupRequest = z.object({ joinCode: JoinCode });
export type StudentLookupRequest = z.infer<typeof StudentLookupRequest>;

export const StudentLookupResponse = z.object({
  className: z.string(),
  students: z.array(
    z.object({
      username: z.string(),
      displayName: z.string(),
      secretKind: StudentSecretKind,
    }),
  ),
});
export type StudentLookupResponse = z.infer<typeof StudentLookupResponse>;

export const StudentLoginRequest = z.object({
  joinCode: JoinCode,
  username: z.string().trim().toLowerCase().min(1).max(60),
  // Picture ids and word codes are both lowercase.
  secret: z.string().trim().toLowerCase().min(1).max(60),
});
export type StudentLoginRequest = z.infer<typeof StudentLoginRequest>;

export const MeResponse = z.object({
  id: z.string(),
  role: Role,
  displayName: z.string(),
  username: z.string(),
  classes: z.array(z.object({ id: z.string(), name: z.string() })),
});
export type MeResponse = z.infer<typeof MeResponse>;

/** Where each role lands after logging in. */
export function homePathFor(role: Role): string {
  return role === 'STUDENT' ? '/home' : role === 'ADMIN' ? '/admin' : '/classes';
}
