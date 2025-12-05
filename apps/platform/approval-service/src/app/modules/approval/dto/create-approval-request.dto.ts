import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApprovalRequestDto {
  @ApiProperty({ example: 'PAYROLL', description: '결재 요청 타입' })
  @IsString()
  requestType: string;

  @ApiProperty({ example: 123, description: '원본 문서 ID' })
  @IsInt()
  referenceId: number;

  @ApiProperty({ example: 'Payroll', description: '원본 문서 타입' })
  @IsString()
  referenceType: string;

  @ApiProperty({ example: 1, description: '요청자 ID' })
  @IsInt()
  requesterId: number;

  @ApiProperty({ example: '급여 처리 결재 요청', description: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2023년 10월 급여', description: '설명', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'NORMAL', description: '우선순위', required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ example: 1, description: '테넌트 ID' })
  @IsInt()
  tenantId: number;
}
