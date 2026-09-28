import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

export * from './generated/prisma/client.js';

/**
 * Create a Prisma client for PostgreSQL. Prisma 7 needs an explicit driver adapter.
 * The client connects lazily, so creating it without a running database is safe.
 */
export function createPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
