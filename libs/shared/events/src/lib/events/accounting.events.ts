import { BaseEvent } from '../base-event.interface';

/**
 * 회계 전표 생성 이벤트
 */
export interface VoucherCreatedEvent extends BaseEvent {
  eventType: 'voucher.created';
  data: {
    voucherId: number;
    voucherNumber: string;
    voucherDate: Date;
    totalDebitAmount: number;
    totalCreditAmount: number;
  };
}

/**
 * 회계 전표 승인 이벤트
 */
export interface VoucherApprovedEvent extends BaseEvent {
  eventType: 'voucher.approved';
  data: {
    voucherId: number;
    approvedBy: number;
    approvedAt: Date;
  };
}

/**
 * 결산 완료 이벤트
 */
export interface SettlementCompletedEvent extends BaseEvent {
  eventType: 'settlement.completed';
  data: {
    settlementId: number;
    year: number;
    month: number;
    completedAt: Date;
    totalRevenue: number;
    totalExpense: number;
    netIncome: number;
  };
}

/**
 * 계정과목 변경 이벤트
 */
export interface AccountChangedEvent extends BaseEvent {
  eventType: 'account.changed';
  data: {
    accountId: number;
    accountCode: string;
    accountName: string;
    changedFields: string[];
  };
}
