import { Module } from '@nestjs/common';
import { ClassAccessService } from '../classes/class-access.service.js';
import { SafetyService } from './safety.service.js';
import { TeacherFlagsController } from './teacher-flags.controller.js';

@Module({
  controllers: [TeacherFlagsController],
  // ClassAccessService only needs the database, so the worker can use this module on its own.
  providers: [SafetyService, ClassAccessService],
  exports: [SafetyService],
})
export class SafetyModule {}
