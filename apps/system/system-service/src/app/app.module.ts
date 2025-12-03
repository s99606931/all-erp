import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from '@all-erp/shared/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonCodeModule } from './common-code/common-code.module';
import { DepartmentModule } from './department/department.module';
import { TenantEventHandler } from './events/tenant-event.handler';
import { RabbitMQModule, PrismaModule } from '@all-erp/shared/infra';

/**
 * 애플리케이션의 루트 모듈
 * 주요 컨트롤러와 프로바이더를 등록합니다.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    PrismaModule,
    RabbitMQModule,
    CommonCodeModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, TenantEventHandler],
})
export class AppModule {}
