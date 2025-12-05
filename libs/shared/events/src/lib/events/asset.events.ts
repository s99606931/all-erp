import { BaseEvent } from '../base-event.interface';

/**
 * 자산 등록 이벤트
 */
export interface AssetRegisteredEvent extends BaseEvent {
  eventType: 'asset.registered';
  data: {
    assetId: number;
    assetNumber: string;
    name: string;
    categoryId: number;
    acquisitionAmount: number;
    acquisitionDate: Date;
  };
}

/**
 * 자산 배정 이벤트
 */
export interface AssetAssignedEvent extends BaseEvent {
  eventType: 'asset.assigned';
  data: {
    assetId: number;
    employeeId: number;
    departmentId: number;
    assignedAt: Date;
  };
}

/**
 * 자산 회수 이벤트
 */
export interface AssetReturnedEvent extends BaseEvent {
  eventType: 'asset.returned';
  data: {
    assetId: number;
    employeeId: number;
    returnedAt: Date;
  };
}

/**
 * 자산 폐기 이벤트
 */
export interface AssetDisposedEvent extends BaseEvent {
  eventType: 'asset.disposed';
  data: {
    assetId: number;
    disposalDate: Date;
    disposalReason: string;
    disposalAmount: number;
  };
}
