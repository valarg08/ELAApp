import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { API_PREFIX } from '@storyforge/shared';
import { AppModule } from './app.module.js';
import { ENV } from './config/config.module.js';
import type { Env } from './config/env.js';
import { configureApp } from './setup.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const env = app.get<Env>(ENV);
  configureApp(app, env.WEB_ORIGIN);
  await app.listen(env.API_PORT);
  Logger.log(`API ready at http://localhost:${env.API_PORT}/${API_PREFIX}`, 'Bootstrap');
}
await bootstrap();
