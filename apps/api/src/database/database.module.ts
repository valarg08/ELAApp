import { Global, Module } from '@nestjs/common';
import { AuditService } from '../common/audit.service.js';
import { DatabaseService } from './database.service.js';

@Global()
@Module({
  providers: [DatabaseService, AuditService],
  exports: [DatabaseService, AuditService],
})
export class DatabaseModule {}
