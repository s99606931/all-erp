import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedInfraModule, EventModule, PrismaService } from '@all-erp/shared/infra';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { ApprovalModule } from './modules/approval/approval.module';

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
    ApprovalModule,
  ],
})
export class AppModule {}
