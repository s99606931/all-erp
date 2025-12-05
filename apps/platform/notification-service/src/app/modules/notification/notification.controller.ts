import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

/**
 * 알림 컨트롤러
 * 알림 발송 및 관리 API를 제공합니다.
 */
@ApiTags('Notifications')
@Controller('api/v1/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * 알림 발송
   */
  @Post()
  @ApiOperation({ summary: '알림 발송' })
  @ApiResponse({ status: 201, description: '알림이 성공적으로 생성되었습니다.' })
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  /**
   * 알림 목록 조회
   */
  @Get()
  @ApiOperation({ summary: '알림 목록 조회' })
  @ApiResponse({ status: 200, description: '알림 목록 조회 성공' })
  async findAll(
    @Query('recipientId') recipientId?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.notificationService.findAll(
      recipientId ? parseInt(recipientId) : undefined,
      tenantId ? parseInt(tenantId) : undefined,
    );
  }

  /**
   * 알림 상세 조회
   */
  @Get(':id')
  @ApiOperation({ summary: '알림 상세 조회' })
  @ApiResponse({ status: 200, description: '알림 조회 성공' })
  async findOne(@Param('id') id: string) {
    return this.notificationService.findOne(parseInt(id));
  }

  /**
   * 읽음 처리
   */
  @Patch(':id/read')
  @ApiOperation({ summary: '읽음 처리' })
  @ApiResponse({ status: 200, description: '읽음 처리 성공' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(parseInt(id));
  }
}
