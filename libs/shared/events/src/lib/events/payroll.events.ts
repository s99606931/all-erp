import { BaseEvent } from '../base-event.interface';

/**
 * 급여 계산 완료 이벤트
 */
export interface PayrollCalculatedEvent extends BaseEvent {
  eventType: 'payroll.calculated';
  data: {
    payrollId: number;
    employeeId: number;
    yearMonth: string; // YYYY-MM 형식
    totalAmount: number;
  };
}

/**
 * 급여 승인 이벤트
 */
export interface PayrollApprovedEvent extends BaseEvent {
  eventType: 'payroll.approved';
  data: {
    payrollId: number;
    employeeId: number;
    yearMonth: string;
    approvedBy: number; // 승인자 ID
    approvedAt: Date;
  };
}

/**
 * 급여 지급 완료 이벤트
 */
export interface PayrollPaidEvent extends BaseEvent {
  eventType: 'payroll.paid';
  data: {
    payrollId: number;
    employeeId: number;
    yearMonth: string;
    totalAmount: number;
    paidAt: Date;
  };
}

/**
 * 급여 항목 변경 이벤트
 */
export interface PayrollItemChangedEvent extends BaseEvent {
  eventType: 'payroll.item.changed';
  data: {
    payrollId: number;
    employeeId: number;
    changedItems: {
      itemCode: string;
      itemName: string;
      oldAmount: number;
      newAmount: number;
    }[];
  };
}
