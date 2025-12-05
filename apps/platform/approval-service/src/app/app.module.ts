import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { ApprovalModule } from './modules/approval/approval.module';
import { PrismaModule } from '../prisma.module';

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
    ApprovalModule,
  ],
})
export class AppModule {}
