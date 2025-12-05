import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Readable } from 'stream';

/**
 * Minio 객체 스토리지 서비스
 * 파일 업로드/다운로드/삭제 기능 제공
 */
@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client;
  private readonly bucketName = 'erp-files';

  constructor(private readonly configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: this.configService.get<number>('MINIO_PORT', 9000),
      useSSL: this.configService.get<boolean>('MINIO_USE_SSL', false),
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async onModuleInit() {
    try {
      // 버킷 존재 여부 확인 및 생성
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`✅ Bucket '${this.bucketName}' created successfully`);
      } else {
        this.logger.log(`✅ Bucket '${this.bucketName}' already exists`);
      }
    } catch (error) {
      this.logger.error('❌ Failed to initialize Minio bucket', error);
      throw error;
    }
  }

  /**
   * 파일 업로드
   * @param storageKey Minio 객체 키 (UUID 등)
   * @param stream 파일 스트림
   * @param size 파일 크기 (bytes)
   * @param mimeType MIME 타입
   */
  async uploadFile(
    storageKey: string,
    stream: Readable | Buffer,
    size: number,
    mimeType: string
  ): Promise<void> {
    try {
      await this.client.putObject(
        this.bucketName,
        storageKey,
        stream,
        size,
        {
          'Content-Type': mimeType,
        }
      );
      this.logger.log(`✅ File uploaded: ${storageKey}`);
    } catch (error) {
      this.logger.error(`❌ Failed to upload file: ${storageKey}`, error);
      throw error;
    }
  }

  /**
   * 파일 다운로드 (스트림 반환)
   * @param storageKey Minio 객체 키
   */
  async downloadFile(storageKey: string): Promise<Readable> {
    try {
      const stream = await this.client.getObject(this.bucketName, storageKey);
      this.logger.log(`✅ File downloaded: ${storageKey}`);
      return stream;
    } catch (error) {
      this.logger.error(`❌ Failed to download file: ${storageKey}`, error);
      throw error;
    }
  }

  /**
   * 파일 삭제
   * @param storageKey Minio 객체 키
   */
  async deleteFile(storageKey: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, storageKey);
      this.logger.log(`✅ File deleted: ${storageKey}`);
    } catch (error) {
      this.logger.error(`❌ Failed to delete file: ${storageKey}`, error);
      throw error;
    }
  }

  /**
   * 파일 메타데이터 조회
   * @param storageKey Minio 객체 키
   */
  async getFileMetadata(storageKey: string) {
    try {
      const stat = await this.client.statObject(this.bucketName, storageKey);
      return stat;
    } catch (error) {
      this.logger.error(`❌ Failed to get file metadata: ${storageKey}`, error);
      throw error;
    }
  }

  /**
   * Presigned URL 생성 (임시 다운로드 링크)
   * @param storageKey Minio 객체 키
   * @param expirySeconds 만료 시간 (초, 기본 1시간)
   */
  async getPresignedUrl(storageKey: string, expirySeconds = 3600): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(
        this.bucketName,
        storageKey,
        expirySeconds
      );
      return url;
    } catch (error) {
      this.logger.error(`❌ Failed to generate presigned URL: ${storageKey}`, error);
      throw error;
    }
  }
}
