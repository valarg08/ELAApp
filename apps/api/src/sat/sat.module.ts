import { Module } from '@nestjs/common';
import { SatContentService } from './sat-content.service.js';
import { SatController } from './sat.controller.js';
import { SatPracticeService } from './sat-practice.service.js';
import { SatService } from './sat.service.js';

/** SAT Math's weekly tests (sat-design.md): two timed modules, adaptive, scored on the server. */
@Module({
  controllers: [SatController],
  providers: [SatContentService, SatService, SatPracticeService],
})
export class SatModule {}
