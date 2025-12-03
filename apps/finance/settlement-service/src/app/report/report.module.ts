import { Module } from '@nestjs/common';
import { PrismaModule } from '@all-erp/shared/infra';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
