import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 파일 목록 조회 쿼리 DTO
 */
export class GetFilesQueryDto {
  @ApiPropertyOptional({ description: '테넌트 ID' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tenantId?: number;

  @ApiPropertyOptional({ description: '업로더 ID' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  uploadedBy?: number;
}
