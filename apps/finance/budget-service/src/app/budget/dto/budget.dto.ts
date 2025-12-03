import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({ example: 'tenant-uuid' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: 'dept-uuid', required: false })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ example: 'PERSONNEL' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 2024 })
  @IsInt()
  fiscalYear!: number;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  amount!: number;
}

export class UpdateSpentDto {
  @ApiProperty({ example: 50000 })
  @IsNumber()
  amount!: number;
}
