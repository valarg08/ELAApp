import type { INestApplication } from '@nestjs/common';
import { API_PREFIX } from '@storyforge/shared';

/** App-wide HTTP setup, shared by main.ts and the e2e tests so they behave the same. */
export function configureApp(app: INestApplication, webOrigin: string): void {
  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({ origin: webOrigin, credentials: true });
  app.enableShutdownHooks();
}
