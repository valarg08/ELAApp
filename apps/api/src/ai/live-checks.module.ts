import { Module } from '@nestjs/common';
import { CurriculumModule } from '../curriculum/curriculum.module.js';
import { SafetyModule } from '../safety/safety.module.js';
import { LiveChecksController } from './live-checks.controller.js';
import { LiveChecksService } from './live-checks.service.js';
import { TutorController } from './tutor.controller.js';
import { TutorService } from './tutor.service.js';

@Module({
  imports: [CurriculumModule, SafetyModule],
  controllers: [LiveChecksController, TutorController],
  providers: [LiveChecksService, TutorService],
  // The Math track's Quill shares the tutor rate limit.
  exports: [TutorService],
})
export class LiveChecksModule {}
