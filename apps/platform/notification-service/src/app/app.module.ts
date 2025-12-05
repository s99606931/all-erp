import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { NotificationModule } from './modules/notification/notification.module';
import { PrismaModule } from '../prisma.module';

/**
 * 애플리케이션의 루트 모듈
 * 알림 관련 모듈을 등록합니다.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
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
