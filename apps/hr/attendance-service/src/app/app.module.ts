import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { PrismaModule } from '../prisma.module';
import { LeaveModule } from './leave/leave.module';
import { PrismaModule } from '../prisma.module';

/**
 * 애플리케이션의 루트 모듈
 * 주요 컨트롤러와 프로바이더를 등록합니다.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SharedDomainModule,
    AttendanceModule,
    LeaveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
