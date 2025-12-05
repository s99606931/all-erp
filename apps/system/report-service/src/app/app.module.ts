import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { ReportTemplateModule } from './report-template/report-template.module';
import { PrismaService } from './prisma.service';

/**
 * 애플리케이션의 루트 모듈
 * 보고서 및 템플릿 관련 모듈을 등록합니다.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ReportModule,
    ReportTemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
