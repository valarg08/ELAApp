/**
 * Create a teacher or admin account with a strong random password, or reset an existing one's
 * password. For real sites, where teacher sign-up is closed and db:seed never runs.
 *   pnpm user:create --role ADMIN --email you@school.org --name "Ms Rivera"
 *   pnpm user:create --email you@school.org --reset
 * The password is printed once; it is stored only as a hash.
 */
import { randomBytes } from 'node:crypto';
import { parseArgs } from 'node:util';
import { createPrismaClient } from '@storyforge/db';
import { PasswordService } from '../auth/password.service.js';
import { loadEnvFile } from '../config/env.js';

const { values } = parseArgs({
  options: {
    role: { type: 'string', default: 'TEACHER' },
    email: { type: 'string' },
    name: { type: 'string' },
    reset: { type: 'boolean', default: false },
  },
});
const email = values.email?.trim().toLowerCase();
const role = values.role.toUpperCase();
if (
  !email ||
  !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
  (role !== 'TEACHER' && role !== 'ADMIN')
) {
  console.error(
    'Usage: pnpm user:create --role TEACHER|ADMIN --email <email> --name "<name>" [--reset]',
  );
  process.exit(1);
}

loadEnvFile();
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('✗ DATABASE_URL is not set.');
  process.exit(1);
}

const db = createPrismaClient(url);
try {
  const password = randomBytes(15).toString('base64url');
  const passwordHash = await new PasswordService().hash(password);
  const existing = await db.user.findUnique({ where: { email } });
  if (existing && !values.reset) {
    console.error(`✗ ${email} already has an account. Add --reset to give it a new password.`);
    process.exitCode = 1;
  } else if (existing) {
    await db.user.update({
      where: { id: existing.id },
      data: { passwordHash, failedLogins: 0, lockedUntil: null },
    });
    console.log(`✓ New password for ${email} (${existing.role.toLowerCase()}): ${password}`);
  } else {
    const base =
      email
        .split('@')[0]!
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'teacher';
    let username = base;
    while (await db.user.findUnique({ where: { username } })) {
      username = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    await db.user.create({
      data: {
        role,
        email,
        displayName: values.name?.trim() || base,
        username,
        passwordHash,
      },
    });
    console.log(`✓ Created ${role.toLowerCase()} ${email} with password: ${password}`);
  }
  if (!process.exitCode) console.log('  Keep it somewhere safe; it is not shown again.');
} finally {
  await db.$disconnect();
}
