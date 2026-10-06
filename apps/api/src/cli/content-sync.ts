/**
 * Validate /content and (unless --check) sync it into the database.
 *   node apps/api/dist/cli/content-sync.js [--check]
 * Exit code 1 if the content is invalid.
 */
import { createPrismaClient } from '@storyforge/db';
import { loadEnvFile } from '../config/env.js';
import { defaultContentDir, loadContent } from '../curriculum/content-loader.js';
import { syncContent } from '../curriculum/content-sync.js';

loadEnvFile();
const checkOnly = process.argv.includes('--check');
const root = defaultContentDir();
const { units, errors } = await loadContent(root);

if (errors.length > 0) {
  console.error(`✗ Content has ${errors.length} problem(s) in ${root}:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const lessons = units.reduce((n, u) => n + u.lessons.length, 0);
const activities = units.reduce((n, u) => n + u.activities.length, 0);
console.log(
  `✓ Content is valid: ${units.length} units, ${lessons} lessons, ${activities} activities.`,
);
if (checkOnly) process.exit(0);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('✗ DATABASE_URL is not set.');
  process.exit(1);
}
const db = createPrismaClient(url);
try {
  const report = await syncContent(db, units);
  console.log(
    `✓ Synced ${report.units} units, ${report.lessons} lessons, ${report.activities} activities.`,
  );
  if (report.orphans.length > 0) {
    console.warn(
      `! In the database but no longer in /content (kept): ${report.orphans.join(', ')}`,
    );
  }
} finally {
  await db.$disconnect();
}
