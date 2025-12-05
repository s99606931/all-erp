import { Module } from '@nestjs/common';
import { ReportTemplateController } from './report-template.controller';
import { ReportTemplateService } from './report-template.service';

/**
 * 보고서 템플릿 모듈
 * 템플릿 관리 기능을 제공합니다.
 */
@Module({
  controllers: [ReportTemplateController],
  providers: [ReportTemplateService],
  exports: [ReportTemplateService],
})
export class ReportTemplateModule {}
