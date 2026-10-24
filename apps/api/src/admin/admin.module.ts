import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { LogsService } from './logs.service.js';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, LogsService],
})
export class AdminModule {}
