import { Injectable } from '@nestjs/common';
import { BaseHttpClient } from './base-http.client';
import { getServiceApiPath } from './service-endpoints';

/**
 * 알림 발송 요청 DTO
 */
export interface SendNotificationDto {
  recipientIds: number[];
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  metadata?: Record<string, unknown>;
}

/**
 * 알림 정보 DTO
 */
export interface NotificationDto {
  id: number;
  recipientId: number;
  title: string;
  message: string;
  type: string;
  channel: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

/**
 * Notification Service 클라이언트
 * 
 * 알림 발송 및 조회를 위한 API 클라이언트
 */
@Injectable()
export class NotificationServiceClient {
  constructor(private readonly httpClient: BaseHttpClient) {}

  /**
   * 알림 발송
   */
  async sendNotification(
    dto: SendNotificationDto,
    tenantId: number
  ): Promise<{ notificationId: number }> {
    const url = getServiceApiPath('NOTIFICATION_SERVICE', '/notifications');
    return this.httpClient.post(url, dto, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 사용자 알림 목록 조회
   */
  async getUserNotifications(
    userId: number,
    tenantId: number,
    params?: { isRead?: boolean; limit?: number }
  ): Promise<NotificationDto[]> {
    const url = getServiceApiPath('NOTIFICATION_SERVICE', `/users/${userId}/notifications`);
    return this.httpClient.get<NotificationDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
      params,
    });
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(notificationId: number, tenantId: number): Promise<void> {
    const url = getServiceApiPath('NOTIFICATION_SERVICE', `/notifications/${notificationId}/read`);
    await this.httpClient.post(url, {}, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(userId: number, tenantId: number): Promise<void> {
    const url = getServiceApiPath('NOTIFICATION_SERVICE', `/users/${userId}/notifications/read-all`);
    await this.httpClient.post(url, {}, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }
}
