// 근태 정보
export interface Attendance {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string | null; // ISO DateTime
  checkOut?: string | null; // ISO DateTime
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE';
  workHours?: number | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// 휴가 신청 정보
export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'ANNUAL' | 'SICK' | 'PERSONAL';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// 휴가 요약 정보 (UI용)
export interface LeaveSummary {
  annualTotal: number;
  annualUsed: number;
  annualRemaining: number;
}
