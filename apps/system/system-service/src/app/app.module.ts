import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from '@all-erp/shared/config';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonCodeModule } from './common-code/common-code.module';
import { PrismaModule } from '../prisma.module';
import { DepartmentModule } from './department/department.module';
import { PrismaModule } from '../prisma.module';
import { TenantEventHandler } from './events/tenant-event.handler';

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
    SharedDomainModule,
    CommonCodeModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, TenantEventHandler],
})
export class AppModule {}
