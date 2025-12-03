import { Module } from '@nestjs/common';
import { PrismaModule, RabbitMQModule } from '@all-erp/shared/infra';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';

@Module({
  imports: [PrismaModule, RabbitMQModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
