import { Module } from '@nestjs/common';
import { CurriculumModule } from '../curriculum/curriculum.module.js';
import { SafetyModule } from '../safety/safety.module.js';
import { LiveChecksController } from './live-checks.controller.js';
import { LiveChecksService } from './live-checks.service.js';

@Module({
  imports: [CurriculumModule, SafetyModule],
  controllers: [LiveChecksController],
  providers: [LiveChecksService],
})
export class LiveChecksModule {}
