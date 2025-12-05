import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '@all-erp/shared/infra';
import { NotificationService } from './notification.service';
import { NotificationType } from './dto/create-notification.dto';

/**
 * 알림 이벤트 핸들러
 * 다른 서비스의 이벤트를 수신하여 알림을 발송합니다.
 */
@Injectable()
export class NotificationEventHandler {
  private readonly logger = new Logger(NotificationEventHandler.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly notificationService: NotificationService,
  ) {
    this.registerEventHandlers();
  }

  /**
   * 이벤트 핸들러 등록
   */
  private registerEventHandlers() {
    // 결재 승인 이벤트
    this.rabbitMQService.subscribe('approval.completed', async (event) => {
      await this.handleApprovalCompleted(event);
    });

    // 보고서 생성 완료 이벤트
    this.rabbitMQService.subscribe('report.generated', async (event) => {
      await this.handleReportGenerated(event);
    });

    this.logger.log('Event handlers registered');
  }

  /**
   * 결재 완료 이벤트 처리
   */
  private async handleApprovalCompleted(event: any) {
    try {
      this.logger.log(`Handling approval.completed event: ${event.eventId}`);

      const { requesterId, status, title, tenantId } = event.data;

      await this.notificationService.create({
        recipientId: requesterId,
        type: NotificationType.EMAIL,
        title: status === 'APPROVED' ? '결재 승인' : '결재 반려',
        content: `${title} 건이 ${status === 'APPROVED' ? '승인' : '반려'}되었습니다.`,
        tenantId,
      });

      this.logger.log(`Approval notification sent to user ${requesterId}`);
    } catch (error) {
      this.logger.error('Failed to handle approval.completed event', error);
      throw error;
    }
  }

  /**
   * 보고서 생성 완료 이벤트 처리
   */
  private async handleReportGenerated(event: any) {
    try {
      this.logger.log(`Handling report.generated event: ${event.eventId}`);

      const { generatedBy, title, fileUrl, tenantId } = event.data;

      await this.notificationService.create({
        recipientId: generatedBy,
        type: NotificationType.EMAIL,
        title: '보고서 생성 완료',
        content: `${title} 보고서가 생성되었습니다. 다운로드: ${fileUrl}`,
        tenantId,
        metadata: {
          reportUrl: fileUrl,
        },
      });

      this.logger.log(`Report notification sent to user ${generatedBy}`);
    } catch (error) {
      this.logger.error('Failed to handle report.generated event', error);
      throw error;
    }
  }
}
