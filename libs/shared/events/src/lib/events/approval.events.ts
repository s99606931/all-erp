import { BaseEvent } from '../base-event.interface';

/**
 * 결재 요청 이벤트
 */
export interface ApprovalRequestedEvent extends BaseEvent {
  eventType: 'approval.requested';
  data: {
    approvalId: number;
    documentType: string; // 문서 타입 (예: 'BUDGET', 'PAYROLL', 'LEAVE')
    documentId: number;
    requesterId: number;
    approverIds: number[]; // 결재자 목록
    title: string;
    urgency: 'LOW' | 'NORMAL' | 'HIGH';
  };
}

/**
 * 결재 승인 이벤트
 */
export interface ApprovalApprovedEvent extends BaseEvent {
  eventType: 'approval.approved';
  data: {
    approvalId: number;
    documentType: string;
    documentId: number;
    approverId: number;
    approvedAt: Date;
    comment?: string;
  };
}

/**
 * 결재 반려 이벤트
 */
export interface ApprovalRejectedEvent extends BaseEvent {
  eventType: 'approval.rejected';
  data: {
    approvalId: number;
    documentType: string;
    documentId: number;
    rejectedBy: number;
    rejectedAt: Date;
    reason: string;
  };
}

/**
 * 결재 취소 이벤트
 */
export interface ApprovalCancelledEvent extends BaseEvent {
  eventType: 'approval.cancelled';
  data: {
    approvalId: number;
    documentType: string;
    documentId: number;
    cancelledBy: number;
    cancelledAt: Date;
    reason: string;
  };
}

/**
 * 결재선 변경 이벤트
 */
export interface ApprovalLineChangedEvent extends BaseEvent {
  eventType: 'approval.line.changed';
  data: {
    approvalId: number;
    oldApproverIds: number[];
    newApproverIds: number[];
    changedBy: number;
  };
}
