import { Module } from '@nestjs/common';
import { InfraModule } from '@all-erp/shared/infra';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [InfraModule, SharedDomainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
