import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 'tenant-uuid' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: 'dept-uuid', required: false })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ example: 'Manager', required: false })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  salary!: number;

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  joinDate!: string;
}
