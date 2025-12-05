import { Module } from '@nestjs/common';
import { InfraModule } from '@all-erp/shared/infra';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleModule } from './vehicle/vehicle.module';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [InfraModule, SharedDomainModule, VehicleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
