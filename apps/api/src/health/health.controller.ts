import { Controller, Get } from '@nestjs/common';
import { type HealthResponse, overallStatus } from '@storyforge/shared';
import { Public } from '../auth/decorators.js';
import { DatabaseService } from '../database/database.service.js';

const VERSION = process.env.npm_package_version ?? '0.0.0';

@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  /** Liveness + dependency report. Always 200 while the process is up (DESIGN.md §5). */
  @Get()
  async check(): Promise<HealthResponse> {
    const checks = { database: await this.database.ping() };
    return {
      status: overallStatus(checks),
      service: 'api',
      version: VERSION,
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      checks,
    };
  }
}
