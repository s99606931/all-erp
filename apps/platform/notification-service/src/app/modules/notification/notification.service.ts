import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

/**
 * 알림 서비스
 * 알림 발송 및 관리 비즈니스 로직을 담당합니다.
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 알림 생성 및 발송
   * @param dto 알림 생성 DTO
   */
  async create(dto: CreateNotificationDto) {
    this.logger.log(`Creating notification: ${dto.title}`);

    // 1. 알림 레코드 생성
    const notification = await this.prisma.notification.create({
      data: {
        recipientId: dto.recipientId,
        type: dto.type,
        title: dto.title,
        content: dto.content,
        status: 'PENDING',
        tenantId: dto.tenantId,
        metadata: dto.metadata || null,
      },
    });

    // 2. 비동기로 알림 발송
    this.sendNotificationAsync(notification.id).catch((err) => {
      this.logger.error(`Failed to send notification ${notification.id}`, err);
    });

    return notification;
  }

  /**
   * 알림 목록 조회
   * @param recipientId 수신자 ID
   * @param tenantId 테넌트 ID
   */
  async findAll(recipientId?: number, tenantId?: number) {
    return this.prisma.notification.findMany({
      where: {
        ...(recipientId && { recipientId }),
        ...(tenantId && { tenantId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 알림 상세 조회
   * @param id 알림 ID
   */
  async findOne(id: number) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  /**
   * 읽음 처리
   * @param id 알림 ID
   */
  async markAsRead(id: number) {
    // 현재 스키마에는 read 필드가 없으므로 metadata를 활용
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    const metadata = (notification.metadata as Record<string, any>) || {};

    return this.prisma.notification.update({
      where: { id },
      data: {
        metadata: {
          ...metadata,
          readAt: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * 비동기로 알림 발송
   * @param notificationId 알림 ID
   */
  private async sendNotificationAsync(notificationId: number) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      // 상태를 SENT로 업데이트
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      this.logger.log(`Notification ${notificationId} sent successfully`);

      // TODO: 실제 이메일/SMS/Push 발송 로직 구현
      // - EMAIL: NodeMailer
      // - SMS: Twilio, AWS SNS 등
      // - PUSH: Firebase Cloud Messaging

    } catch (error) {
      // 실패 시 FAILED 상태로 업데이트
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      throw error;
    }
  }
}
