import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { ClassesModule } from './classes/classes.module.js';
import { ConfigModule } from './config/config.module.js';
import { CurriculumModule } from './curriculum/curriculum.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { WritingModule } from './writing/writing.module.js';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    HealthModule,
    ClassesModule,
    CurriculumModule,
    WritingModule,
  ],
})
export class AppModule {}
