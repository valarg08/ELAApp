import { Module } from '@nestjs/common';
import { MathModule } from '../math/math.module.js';
import { MentalController, MentalTeacherController } from './mental.controller.js';
import { MentalService } from './mental.service.js';

/** The Mental Math track's own pages (mental-math-design.md); lessons use the Math engine. */
@Module({
  imports: [MathModule],
  controllers: [MentalController, MentalTeacherController],
  providers: [MentalService],
})
export class MentalModule {}
