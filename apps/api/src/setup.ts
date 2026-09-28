import { StandardSchemaValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { API_PREFIX } from '@storyforge/shared';
import cookieParser from 'cookie-parser';
import { ProblemDetailsFilter } from './common/problem-details.filter.js';

/** App-wide HTTP setup, shared by main.ts and the e2e tests so they behave the same. */
export function configureApp(app: NestExpressApplication, webOrigin: string): void {
  app.setGlobalPrefix(API_PREFIX);
  app.use(cookieParser());
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.useGlobalFilters(new ProblemDetailsFilter());
  app.enableCors({ origin: webOrigin, credentials: true });
  // The web app's /api proxy runs on the same machine; trust it for client IPs.
  app.set('trust proxy', 'loopback');
  app.enableShutdownHooks();
}
