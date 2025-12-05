import { IsInt, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 알림 타입
 */
export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

/**
 * 알림 생성 DTO
 */
export class CreateNotificationDto {
  @ApiProperty({ description: '수신자 ID' })
  @IsInt()
  recipientId: number;

  @ApiProperty({ description: '알림 타입', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: '알림 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '알림 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '테넌트 ID' })
  @IsInt()
  tenantId: number;

  @ApiProperty({ description: '메타데이터 (JSON)', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
