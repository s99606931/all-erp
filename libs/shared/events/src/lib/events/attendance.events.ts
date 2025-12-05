import { BaseEvent } from '../base-event.interface';

/**
 * 근태 기록 생성 이벤트
 */
export interface AttendanceRecordedEvent extends BaseEvent {
  eventType: 'attendance.recorded';
  data: {
    attendanceId: number;
    employeeId: number;
    date: string; // YYYY-MM-DD
    checkInTime: Date;
    checkOutTime?: Date;
    status: 'PRESENT' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT';
  };
}

/**
 * 휴가 신청 이벤트
 */
export interface LeaveRequestedEvent extends BaseEvent {
  eventType: 'leave.requested';
  data: {
    leaveId: number;
    employeeId: number;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    days: number;
  };
}

/**
 * 휴가 승인 이벤트
 */
export interface LeaveApprovedEvent extends BaseEvent {
  eventType: 'leave.approved';
  data: {
    leaveId: number;
    employeeId: number;
    approvedBy: number;
    approvedAt: Date;
  };
}

/**
 * 휴가 반려 이벤트
 */
export interface LeaveRejectedEvent extends BaseEvent {
  eventType: 'leave.rejected';
  data: {
    leaveId: number;
    employeeId: number;
    rejectedBy: number;
    rejectedAt: Date;
    reason: string;
  };
}
