import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({ example: 'tenant-uuid' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: 'Laptop' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'IT Equipment' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsString()
  @IsNotEmpty()
  acquisitionDate!: string;

  @ApiProperty({ example: 1500000 })
  @IsNumber()
  acquisitionValue!: number;
}
