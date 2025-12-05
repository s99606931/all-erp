import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt } from 'class-validator';

/**
 * 보고서 상태 Enum
 */
export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * 보고서 응답 DTO
 */
export class ReportResponseDto {
  @ApiProperty({ description: '보고서 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '보고서 제목', example: '2024년 12월 급여 보고서' })
  title: string;

  @ApiProperty({ description: '보고서 타입', example: 'PAYROLL' })
  reportType: string;

  @ApiProperty({ description: '보고서 포맷', example: 'PDF' })
  format: string;

  @ApiProperty({
    description: '보고서 상태',
    enum: ReportStatus,
    example: ReportStatus.COMPLETED,
  })
  status: string;

  @ApiProperty({ description: '생성자 사용자 ID', example: 1 })
  generatedBy: number;

  @ApiProperty({
    description: '파일 URL',
    example: '/files/reports/2024-12-payroll.pdf',
    nullable: true,
  })
  fileUrl: string | null;

  @ApiProperty({
    description: '에러 메시지',
    example: null,
    nullable: true,
  })
  errorMessage: string | null;

  @ApiProperty({ description: '테넌트 ID', example: 1 })
  tenantId: number;

  @ApiProperty({ description: '생성일시', example: '2024-12-05T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시', example: '2024-12-05T10:35:00Z' })
  updatedAt: Date;
}
