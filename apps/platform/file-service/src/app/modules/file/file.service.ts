import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FilePrismaService } from '../../prisma/file-prisma.service';
import { MinioService } from '../../services/minio.service';
import { EventService } from '@all-erp/shared/infra';
import { File, Prisma } from '@prisma/file-client';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

/**
 * 파일 관리 서비스
 * Minio와 연동하여 파일 업로드/다운로드/삭제 처리
 */
@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly prisma: FilePrismaService,
    private readonly minioService: MinioService,
    private readonly eventService: EventService,
  ) {}

  /**
   * 파일 업로드
   */
  async uploadFile(
    originalName: string,
    buffer: Buffer,
    mimeType: string,
    uploadedBy: number,
    tenantId: number
  ): Promise<File> {
    const storageKey = `${uuidv4()}-${originalName}`;
    const fileName = uuidv4();
    const fileSize = buffer.length;

    try {
      // 1. Minio에 파일 업로드
      await this.minioService.uploadFile(storageKey, buffer, fileSize, mimeType);

      // 2. 트랜잭션으로 DB 저장 및 이벤트 발행
      const file = await this.prisma.$transaction(async (tx) => {
        const createdFile = await tx.file.create({
          data: {
            fileName,
            originalName,
            fileSize,
            mimeType,
            storageKey,
            uploadedBy,
            tenantId,
          },
        });

        // 이벤트 발행: file.uploaded
        await this.eventService.emit('file.uploaded', {
          fileId: createdFile.id,
          originalName: createdFile.originalName,
          fileSize: createdFile.fileSize,
          uploadedBy: createdFile.uploadedBy,
          tenantId: createdFile.tenantId,
        }, tx);

        return createdFile;
      });

      this.logger.log(`✅ File uploaded successfully: ${originalName} (ID: ${file.id})`);
      return file;
    } catch (error) {
      // Minio 업로드 실패 시 롤백
      this.logger.error(`❌ Failed to upload file: ${originalName}`, error);
      
      // Minio에서 파일 삭제 시도
      try {
        await this.minioService.deleteFile(storageKey);
      } catch (cleanupError) {
        this.logger.warn(`Failed to cleanup Minio file: ${storageKey}`, cleanupError);
      }

      throw error;
    }
  }

  /**
   * 파일 목록 조회
   */
  async getFiles(filters: {
    tenantId?: number;
    uploadedBy?: number;
  }): Promise<File[]> {
    const where: Prisma.FileWhereInput = {};
    if (filters.tenantId) where.tenantId = filters.tenantId;
    if (filters.uploadedBy) where.uploadedBy = filters.uploadedBy;

    return this.prisma.file.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 파일 정보 조회
   */
  async getFile(id: number): Promise<File> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  /**
   * 파일 다운로드 (스트림 반환)
   */
  async downloadFile(id: number): Promise<{ stream: Readable; file: File }> {
    const file = await this.getFile(id);
    const stream = await this.minioService.downloadFile(file.storageKey);

    return { stream, file };
  }

  /**
   * Presigned URL 생성 (임시 다운로드 링크)
   */
  async getDownloadUrl(id: number, expirySeconds = 3600): Promise<string> {
    const file = await this.getFile(id);
    return this.minioService.getPresignedUrl(file.storageKey, expirySeconds);
  }

  /**
   * 파일 삭제
   */
  async deleteFile(id: number): Promise<void> {
    const file = await this.getFile(id);

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. DB에서 파일 메타데이터 삭제
        await tx.file.delete({
          where: { id },
        });

        // 2. 이벤트 발행: file.deleted
        await this.eventService.emit('file.deleted', {
          fileId: id,
          originalName: file.originalName,
          storageKey: file.storageKey,
          tenantId: file.tenantId,
        }, tx);
      });

      // 3. Minio에서 파일 삭제
      await this.minioService.deleteFile(file.storageKey);

      this.logger.log(`✅ File deleted successfully: ${file.originalName} (ID: ${id})`);
    } catch (error) {
      this.logger.error(`❌ Failed to delete file: ${file.originalName} (ID: ${id})`, error);
      throw error;
    }
  }
}
