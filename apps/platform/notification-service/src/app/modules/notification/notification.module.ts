import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationEventHandler } from './notification.event-handler';

/**
 * 알림 모듈
 * 알림 발송 및 관리 기능을 제공합니다.
 */
@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationEventHandler],
  exports: [NotificationService],
})
export class NotificationModule {}
