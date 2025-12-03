import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class JournalEntryLineDto {
  @ApiProperty({ example: 'account-uuid' })
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  debit!: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  credit!: number;
}

export class CreateJournalEntryDto {
  @ApiProperty({ example: 'tenant-uuid' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsString()
  @IsNotEmpty()
  entryDate!: string;

  @ApiProperty({ example: 'Office supplies purchase' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ type: [JournalEntryLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines!: JournalEntryLineDto[];
}
