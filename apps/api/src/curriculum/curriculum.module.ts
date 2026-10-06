import { Module } from '@nestjs/common';
import { ClassesModule } from '../classes/classes.module.js';
import { CurriculumController, PacingController } from './curriculum.controller.js';
import { CurriculumService } from './curriculum.service.js';
import { PacingService } from './pacing.service.js';

@Module({
  imports: [ClassesModule],
  controllers: [CurriculumController, PacingController],
  providers: [CurriculumService, PacingService],
})
export class CurriculumModule {}
