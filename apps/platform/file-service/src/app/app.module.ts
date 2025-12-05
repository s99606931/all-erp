import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedDomainModule } from '@all-erp/shared/domain';
import { FileModule } from './modules/file/file.module';
import { PrismaModule } from '../prisma.module';
import { FilePrismaService } from './prisma/file-prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SharedDomainModule,
    EventModule.forRoot({
      repositoryProvider: FilePrismaService,
    }),
    FileModule,
  ],
})
export class AppModule {}
