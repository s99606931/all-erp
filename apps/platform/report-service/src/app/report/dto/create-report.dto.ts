import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt, IsOptional } from 'class-validator';

/**
 * 보고서 타입 Enum
 */
export enum ReportType {
  PERSONNEL = 'PERSONNEL',
  PAYROLL = 'PAYROLL',
  BUDGET = 'BUDGET',
  ACCOUNTING = 'ACCOUNTING',
  ATTENDANCE = 'ATTENDANCE',
  ASSET = 'ASSET',
  SUPPLY = 'SUPPLY',
  GENERAL_AFFAIRS = 'GENERAL_AFFAIRS',
}

/**
 * 보고서 포맷 Enum
 */
export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

/**
 * 보고서 생성 요청 DTO
 */
export class CreateReportDto {
  @ApiProperty({ description: '보고서 제목', example: '2024년 12월 급여 보고서' })
  @IsString()
  title: string;

  @ApiProperty({
    description: '보고서 타입',
    enum: ReportType,
    example: ReportType.PAYROLL,
  })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({
    description: '보고서 포맷',
    enum: ReportFormat,
    example: ReportFormat.PDF,
  })
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiProperty({ description: '생성자 사용자 ID', example: 1 })
  @IsInt()
  generatedBy: number;

  @ApiProperty({ description: '테넌트 ID', example: 1 })
  @IsInt()
  tenantId: number;

  @ApiProperty({
    description: '보고서 템플릿 ID (선택)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  templateId?: number;
}
