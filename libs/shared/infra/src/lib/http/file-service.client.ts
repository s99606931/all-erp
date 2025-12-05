import { Injectable } from '@nestjs/common';
import { BaseHttpClient } from './base-http.client';
import { getServiceApiPath } from './service-endpoints';

/**
 * 파일 정보 DTO
 */
export interface FileDto {
  id: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: number;
  uploadedAt: Date;
  category: string;
  url: string;
}

/**
 * 파일 업로드 응답 DTO
 */
export interface FileUploadResponseDto {
  fileId: number;
  fileName: string;
  fileSize: number;
  url: string;
}

/**
 * File Service 클라이언트
 * 
 * 파일 업로드, 다운로드, 삭제를 위한 API 클라이언트
 */
@Injectable()
export class FileServiceClient {
  constructor(private readonly httpClient: BaseHttpClient) {}

  /**
   * 파일 정보 조회
   */
  async getFile(fileId: number, tenantId: number): Promise<FileDto> {
    const url = getServiceApiPath('FILE_SERVICE', `/files/${fileId}`);
    return this.httpClient.get<FileDto>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 파일 업로드 URL 요청
   * (실제 업로드는 클라이언트에서 직접 MinIO/S3로 수행)
   */
  async requestUploadUrl(
    fileName: string,
    fileSize: number,
    mimeType: string,
    category: string,
    tenantId: number
  ): Promise<{ uploadUrl: string; fileId: number }> {
    const url = getServiceApiPath('FILE_SERVICE', '/files/upload-url');
    return this.httpClient.post(url, {
      fileName,
      fileSize,
      mimeType,
      category,
    }, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 파일 다운로드 URL 요청
   */
  async getDownloadUrl(fileId: number, tenantId: number): Promise<{ downloadUrl: string }> {
    const url = getServiceApiPath('FILE_SERVICE', `/files/${fileId}/download-url`);
    return this.httpClient.get(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 파일 삭제
   */
  async deleteFile(fileId: number, tenantId: number): Promise<void> {
    const url = getServiceApiPath('FILE_SERVICE', `/files/${fileId}`);
    await this.httpClient.delete(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 엔티티 관련 파일 목록 조회
   */
  async getFilesByEntity(
    entityType: string,
    entityId: number,
    tenantId: number
  ): Promise<FileDto[]> {
    const url = getServiceApiPath('FILE_SERVICE', '/files');
    return this.httpClient.get<FileDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
      params: { entityType, entityId },
    });
  }
}
