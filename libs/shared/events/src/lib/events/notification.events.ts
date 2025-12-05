import { BaseEvent } from '../base-event.interface';

/**
 * 알림 발송 이벤트
 */
export interface NotificationSentEvent extends BaseEvent {
  eventType: 'notification.sent';
  data: {
    notificationId: number;
    recipientIds: number[]; // 수신자 목록
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  };
}

/**
 * 알림 읽음 이벤트
 */
export interface NotificationReadEvent extends BaseEvent {
  eventType: 'notification.read';
  data: {
    notificationId: number;
    readBy: number;
    readAt: Date;
  };
}

/**
 * 이메일 발송 이벤트
 */
export interface EmailSentEvent extends BaseEvent {
  eventType: 'email.sent';
  data: {
    emailId: number;
    to: string[];
    cc?: string[];
    subject: string;
    sentAt: Date;
    status: 'SENT' | 'FAILED';
  };
}

/**
 * SMS 발송 이벤트
 */
export interface SmsSentEvent extends BaseEvent {
  eventType: 'sms.sent';
  data: {
    smsId: number;
    phoneNumbers: string[];
    message: string;
    sentAt: Date;
    status: 'SENT' | 'FAILED';
  };
}
