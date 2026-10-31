import { Module } from '@nestjs/common';
import { ClassesModule } from '../classes/classes.module.js';
import { SatContentService } from './sat-content.service.js';
import { SatController } from './sat.controller.js';
import { SatPracticeService } from './sat-practice.service.js';
import { SatScheduleController } from './sat-schedule.controller.js';
import { SatScheduleService } from './sat-schedule.service.js';
import { SatService } from './sat.service.js';

/**
 * SAT Math (sat-design.md): the weekly tests (two timed modules, module 2 chosen from module 1,
 * scored on the server), adaptive practice, and the teacher's class schedule.
 */
@Module({
  imports: [ClassesModule],
  controllers: [SatController, SatScheduleController],
  providers: [SatContentService, SatService, SatPracticeService, SatScheduleService],
})
export class SatModule {}
