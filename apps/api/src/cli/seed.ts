/**
 * Create (or reset) the default development teacher account.
 *   node apps/api/dist/cli/seed.js
 * Refuses to run when NODE_ENV=production. Safe to run again: it resets the password and unlocks.
 */
import { createPrismaClient } from '@storyforge/db';
import { PasswordService } from '../auth/password.service.js';
import { loadEnvFile } from '../config/env.js';

const DEFAULT_TEACHER = {
  email: 'teacher@storyforge.test',
  password: 'storyforge-teacher',
  displayName: 'Demo Teacher',
  username: 'demo-teacher',
} as const;

loadEnvFile();
if (process.env.NODE_ENV === 'production') {
  console.error('✗ db:seed creates a known login and never runs in production.');
  process.exit(1);
}
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('✗ DATABASE_URL is not set.');
  process.exit(1);
}

const db = createPrismaClient(url);
try {
  const passwordHash = await new PasswordService().hash(DEFAULT_TEACHER.password);
  const reset = { passwordHash, failedLogins: 0, lockedUntil: null, deletedAt: null };
  await db.user.upsert({
    where: { email: DEFAULT_TEACHER.email },
    update: reset,
    create: {
      role: 'TEACHER',
      email: DEFAULT_TEACHER.email,
      displayName: DEFAULT_TEACHER.displayName,
      username: DEFAULT_TEACHER.username,
      ...reset,
    },
  });
  console.log(`✓ Default teacher ready: ${DEFAULT_TEACHER.email} (password in README).`);
} finally {
  await db.$disconnect();
}
