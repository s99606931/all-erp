import { BaseEvent } from '../base-event.interface';

/**
 * 물품 요청 이벤트
 */
export interface SupplyRequestedEvent extends BaseEvent {
  eventType: 'supply.requested';
  data: {
    requestId: number;
    employeeId: number;
    departmentId: number;
    items: {
      itemId: number;
      itemName: string;
      quantity: number;
    }[];
  };
}

/**
 * 물품 요청 승인 이벤트
 */
export interface SupplyRequestApprovedEvent extends BaseEvent {
  eventType: 'supply.request.approved';
  data: {
    requestId: number;
    approvedBy: number;
    approvedAt: Date;
  };
}

/**
 * 물품 출고 이벤트
 */
export interface SupplyIssuedEvent extends BaseEvent {
  eventType: 'supply.issued';
  data: {
    issueId: number;
    requestId: number;
    items: {
      itemId: number;
      quantity: number;
    }[];
    issuedAt: Date;
  };
}

/**
 * 물품 재고 부족 알림 이벤트
 */
export interface SupplyLowStockEvent extends BaseEvent {
  eventType: 'supply.low.stock';
  data: {
    itemId: number;
    itemName: string;
    currentStock: number;
    minimumStock: number;
  };
}
