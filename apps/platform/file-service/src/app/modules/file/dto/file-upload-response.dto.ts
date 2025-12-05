import { IsInt, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 파일 업로드 응답 DTO
 */
export class FileUploadResponseDto {
  @ApiProperty({ description: '파일 ID' })
  id: number;

  @ApiProperty({ description: '원본 파일명' })
  originalName: string;

  @ApiProperty({ description: '저장된 파일명 (UUID)' })
  fileName: string;

  @ApiProperty({ description: '파일 크기 (bytes)' })
  fileSize: number;

  @ApiProperty({ description: 'MIME 타입' })
  mimeType: string;

  @ApiProperty({ description: '스토리지 키' })
  storageKey: string;

  @ApiProperty({ description: '업로드 일시' })
  createdAt: Date;
}
