import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetApprovalRequestsDto {
  @ApiProperty({ example: 1, description: '요청자 ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  requesterId?: number;

  @ApiProperty({ example: 'PENDING', description: '상태', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 1, description: '테넌트 ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tenantId?: number;
}
