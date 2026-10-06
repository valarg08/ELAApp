import { Module } from '@nestjs/common';
import { ClassAccessService } from './class-access.service.js';
import { ClassesService } from './classes.service.js';
import { LoginCardsService } from './login-cards.service.js';
import { TeacherClassesController } from './teacher-classes.controller.js';

@Module({
  controllers: [TeacherClassesController],
  providers: [ClassAccessService, ClassesService, LoginCardsService],
  exports: [ClassAccessService],
})
export class ClassesModule {}
