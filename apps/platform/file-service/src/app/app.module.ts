import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedInfraModule, EventModule } from '@all-erp/shared/infra';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { FileModule } from './modules/file/file.module';
import { FilePrismaService } from './prisma/file-prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedInfraModule,
    SharedDomainModule,
    EventModule.forRoot({
      repositoryProvider: FilePrismaService,
    }),
    FileModule,
  ],
})
export class AppModule {}
