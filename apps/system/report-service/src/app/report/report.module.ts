import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportGeneratorService } from './report-generator.service';

/**
 * 보고서 모듈
 * 보고서 생성 및 관리 기능을 제공합니다.
 */
@Module({
  controllers: [ReportController],
  providers: [ReportService, ReportGeneratorService],
  exports: [ReportService],
})
export class ReportModule {}
