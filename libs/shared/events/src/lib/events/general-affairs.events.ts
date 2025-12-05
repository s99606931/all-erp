import { BaseEvent } from '../base-event.interface';

/**
 * 시설 예약 이벤트
 */
export interface FacilityReservedEvent extends BaseEvent {
  eventType: 'facility.reserved';
  data: {
    reservationId: number;
    facilityId: number;
    facilityName: string;
    reservedBy: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
  };
}

/**
 * 시설 예약 취소 이벤트
 */
export interface FacilityReservationCancelledEvent extends BaseEvent {
  eventType: 'facility.reservation.cancelled';
  data: {
    reservationId: number;
    facilityId: number;
    cancelledBy: number;
    cancelledAt: Date;
    reason: string;
  };
}

/**
 * 차량 배차 이벤트
 */
export interface VehicleDispatchedEvent extends BaseEvent {
  eventType: 'vehicle.dispatched';
  data: {
    dispatchId: number;
    vehicleId: number;
    vehicleNumber: string;
    driverId: number;
    requesterId: number;
    departureTime: Date;
    destination: string;
    purpose: string;
  };
}

/**
 * 차량 반납 이벤트
 */
export interface VehicleReturnedEvent extends BaseEvent {
  eventType: 'vehicle.returned';
  data: {
    dispatchId: number;
    vehicleId: number;
    returnedAt: Date;
    mileage: number; // 주행거리
    fuelUsed: number; // 연료 사용량
  };
}

/**
 * 민원 접수 이벤트
 */
export interface ComplaintReceivedEvent extends BaseEvent {
  eventType: 'complaint.received';
  data: {
    complaintId: number;
    category: string;
    title: string;
    submittedBy: number;
    submittedAt: Date;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  };
}

/**
 * 민원 처리 완료 이벤트
 */
export interface ComplaintResolvedEvent extends BaseEvent {
  eventType: 'complaint.resolved';
  data: {
    complaintId: number;
    resolvedBy: number;
    resolvedAt: Date;
    resolution: string;
  };
}
