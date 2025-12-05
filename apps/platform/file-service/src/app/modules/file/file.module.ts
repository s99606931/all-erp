import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FilePrismaService } from '../../prisma/file-prisma.service';
import { MinioService } from '../../services/minio.service';

@Module({
  controllers: [FileController],
  providers: [FilePrismaService, MinioService, FileService],
  exports: [FileService, MinioService],
})
export class FileModule {}
