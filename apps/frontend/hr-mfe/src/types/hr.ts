// 직원 정보
export interface Employee {
  id: string;
  userId: string;
  employeeNumber: string;
  name: string;
  email: string | null;
  phone: string | null;
  departmentId: string;
  departmentName?: string; // 조인된 정보 (선택적)
  positionCode: string;
  positionName?: string; // 조인된 정보 (선택적)
  hireDate: string;
  resignDate?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'RESIGNED';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// 인사 이동 이력
export interface EmployeeHistory {
  id: string;
  employeeId: string;
  eventType: 'HIRED' | 'PROMOTED' | 'TRANSFERRED' | 'RESIGNED';
  eventDate: string;
  fromValue?: string | null; // JSON string
  toValue?: string | null; // JSON string
  reason?: string | null;
  createdAt: string;
}

// 근태 정보
export interface Attendance {
  id: string;
  employeeId: string;
  employeeName?: string; // 조인된 정보
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE';
  workHours?: number | null;
  createdAt: string;
  updatedAt: string;
}

// 휴가 신청
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string; // 조인된 정보
  leaveType: 'ANNUAL' | 'SICK' | 'PERSONAL';
  startDate: string;
  endDate: string;
  days: number;
  reason?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

// 급여 정보
export interface Payroll {
  id: string;
  employeeId: string;
  employeeName?: string; // 조인된 정보
  paymentMonth: string; // YYYY-MM
  baseSalary: number;
  totalAllowance: number;
  totalDeduction: number;
  netPay: number;
  status: 'DRAFT' | 'CONFIRMED' | 'PAID';
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// 급여 항목
export interface PayrollItem {
  id: string;
  payrollId: string;
  itemType: 'ALLOWANCE' | 'DEDUCTION';
  itemCode: string;
  itemName: string;
  amount: number;
}

// 부서 정보 (System Service 연동 가정)
export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

// 직급 정보 (System Service CommonCode 연동 가정)
export interface Position {
  id: string;
  code: string;
  name: string;
  level?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}
