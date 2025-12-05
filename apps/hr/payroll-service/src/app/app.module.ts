import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedInfraModule, EventModule, PrismaService } from '@all-erp/shared/infra';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayrollModule } from './payroll/payroll.module';
import { EmployeeEventListener } from './listeners/employee-event.listener';

/**
 * 애플리케이션의 루트 모듈
 * 주요 컨트롤러와 프로바이더를 등록합니다.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SharedInfraModule,
    SharedDomainModule,
    EventModule.forRoot({
      repositoryProvider: PrismaService,
    }),
    PayrollModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmployeeEventListener],
})
export class AppModule {}
