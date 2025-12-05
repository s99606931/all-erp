import { IsInt, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveRequestDto {
  @ApiProperty({ example: 1, description: '결재선 ID' })
  @IsInt()
  approvalLineId: number;

  @ApiProperty({ example: '승인합니다.', description: '코멘트', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
