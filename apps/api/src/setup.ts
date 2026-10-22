import { StandardSchemaValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { API_PREFIX } from '@storyforge/shared';
import cookieParser from 'cookie-parser';
import { ProblemDetailsFilter } from './common/problem-details.filter.js';
import { rateLimit, securityHeaders } from './common/rate-limit.js';

/** App-wide HTTP setup, shared by main.ts and the e2e tests so they behave the same. */
export function configureApp(app: NestExpressApplication, webOrigin: string): void {
  app.setGlobalPrefix(API_PREFIX);
  app.disable('x-powered-by');
  app.use(securityHeaders);
  // Sign-in and sign-up on real sites: 100 tries per IP per 5 minutes (a class may share one
  // school IP). Off in development and tests, which sign in far more often from one machine.
  if (process.env.NODE_ENV === 'production') {
    app.use(
      ['login', 'register', 'student/login', 'student/lookup'].map(
        (p) => `/${API_PREFIX}/auth/${p}`,
      ),
      rateLimit({ limit: 100, windowMs: 5 * 60 * 1000 }),
    );
  }
  app.use(cookieParser());
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.useGlobalFilters(new ProblemDetailsFilter());
  app.enableCors({ origin: webOrigin, credentials: true });
  // The web app's /api proxy runs on the same machine; trust it for client IPs.
  app.set('trust proxy', 'loopback');
  app.enableShutdownHooks();
}
