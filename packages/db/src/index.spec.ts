import { describe, expect, it } from 'vitest';
import { Role, createPrismaClient } from './index.js';

describe('@storyforge/db', () => {
  it('exposes the generated enums', () => {
    expect(Role.STUDENT).toBe('STUDENT');
    expect(Object.values(Role)).toEqual(['STUDENT', 'TEACHER', 'ADMIN']);
  });

  it('creates a client without connecting (lazy connection)', async () => {
    const client = createPrismaClient('postgresql://nobody:nothing@127.0.0.1:1/none');
    expect(typeof client.user.findMany).toBe('function');
    await client.$disconnect();
  });
});
