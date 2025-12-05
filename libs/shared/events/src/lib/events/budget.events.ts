import { BaseEvent } from '../base-event.interface';

/**
 * 예산 생성 이벤트
 */
export interface BudgetCreatedEvent extends BaseEvent {
  eventType: 'budget.created';
  data: {
    budgetId: number;
    year: number;
    departmentId: number;
    totalAmount: number;
  };
}

/**
 * 예산 승인 이벤트
 */
export interface BudgetApprovedEvent extends BaseEvent {
  eventType: 'budget.approved';
  data: {
    budgetId: number;
    approvedBy: number; // 승인자 ID
    approvedAt: Date;
  };
}

/**
 * 예산 집행 이벤트
 */
export interface BudgetExecutedEvent extends BaseEvent {
  eventType: 'budget.executed';
  data: {
    budgetId: number;
    executionId: number;
    amount: number;
    remainingAmount: number;
    description: string;
  };
}

/**
 * 예산 초과 알림 이벤트
 */
export interface BudgetExceededEvent extends BaseEvent {
  eventType: 'budget.exceeded';
  data: {
    budgetId: number;
    departmentId: number;
    budgetAmount: number;
    executedAmount: number;
    exceededAmount: number;
  };
}
