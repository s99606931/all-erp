import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'acme' })
  @IsString()
  @IsNotEmpty()
  subdomain!: string;

  @ApiProperty({ example: 'FREE', required: false })
  @IsString()
  @IsOptional()
  subscriptionPlan?: string;
}
