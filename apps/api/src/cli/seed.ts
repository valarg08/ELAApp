/**
 * Create (or reset) the default development teacher and admin accounts.
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

const DEFAULT_ADMIN = {
  email: 'admin@storyforge.test',
  password: 'storyforge-admin',
  displayName: 'Demo Admin',
  username: 'demo-admin',
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
  const passwords = new PasswordService();
  for (const [role, account] of [
    ['TEACHER', DEFAULT_TEACHER],
    ['ADMIN', DEFAULT_ADMIN],
  ] as const) {
    const passwordHash = await passwords.hash(account.password);
    const reset = { passwordHash, failedLogins: 0, lockedUntil: null, deletedAt: null };
    await db.user.upsert({
      where: { email: account.email },
      update: { ...reset, role },
      create: {
        role,
        email: account.email,
        displayName: account.displayName,
        username: account.username,
        ...reset,
      },
    });
    console.log(`✓ Default ${role.toLowerCase()} ready: ${account.email} (password in README).`);
  }
} finally {
  await db.$disconnect();
}
