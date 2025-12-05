import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

/**
 * 보고서 템플릿 생성 DTO
 */
export class CreateReportTemplateDto {
  @ApiProperty({ description: '템플릿 이름', example: '월간 급여 보고서 템플릿' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '템플릿 설명',
    example: '월간 급여 지급 내역 보고서 템플릿',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '보고서 타입',
    example: 'PAYROLL',
  })
  @IsString()
  reportType: string;

  @ApiProperty({
    description: '템플릿 데이터 (JSON)',
    example: '{"columns": ["name", "salary"], "filters": {}}',
  })
  @IsString()
  templateData: string;

  @ApiProperty({ description: '테넌트 ID', example: 1 })
  @IsInt()
  tenantId: number;
}

/**
 * 보고서 템플릿 업데이트 DTO
 */
export class UpdateReportTemplateDto {
  @ApiProperty({ description: '템플릿 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '템플릿 설명', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '템플릿 데이터 (JSON)', required: false })
  @IsOptional()
  @IsString()
  templateData?: string;

  @ApiProperty({ description: '활성화 상태', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 보고서 템플릿 응답 DTO
 */
export class ReportTemplateResponseDto {
  @ApiProperty({ description: '템플릿 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '템플릿 이름', example: '월간 급여 보고서 템플릿' })
  name: string;

  @ApiProperty({ description: '템플릿 설명', nullable: true })
  description: string | null;

  @ApiProperty({ description: '보고서 타입', example: 'PAYROLL' })
  reportType: string;

  @ApiProperty({ description: '템플릿 데이터 (JSON)' })
  templateData: string;

  @ApiProperty({ description: '활성화 상태', example: true })
  isActive: boolean;

  @ApiProperty({ description: '테넌트 ID', example: 1 })
  tenantId: number;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;
}
