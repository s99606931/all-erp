import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedInfraModule, EventModule } from '@all-erp/shared/infra';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { NotificationModule } from './modules/notification/notification.module';

/**
 * 애플리케이션의 루트 모듈
 * 알림 관련 모듈을 등록합니다.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedInfraModule,
    SharedDomainModule,
    EventModule.forRoot({
      repositoryProvider: PrismaService,
    }),
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
