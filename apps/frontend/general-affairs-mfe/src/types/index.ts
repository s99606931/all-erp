/**
 * 총무 관리 공통 타입 정의
 */

// 결재 상태
export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';

// 결재 문서
export interface ApprovalDocument {
  id: string;
  title: string;
  content: string;
  status: ApprovalStatus;
  drafterId: string;
  drafterName: string;
  createdAt: string;
  updatedAt: string;
}

// 차량 상태
export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'DECOMMISSIONED';

// 차량
export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  manufacturer?: string;
  year?: number;
  status: VehicleStatus;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// 차량 예약
export interface VehicleReservation {
  id: string;
  vehicleId: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  purpose?: string;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

// 차량 리스
export interface VehicleLease {
  id: string;
  vehicleId: string;
  lessor: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyFee: number;
  status: 'ACTIVE' | 'EXPIRED';
}

// 차량 검사
export interface VehicleInspection {
  id: string;
  vehicleId: string;
  inspectionType: string;
  inspectionDate: string;
  nextInspectionDate: string;
  result: 'PASS' | 'FAIL';
  cost: number;
}

// 차량 보험
export interface VehicleInsurance {
  id: string;
  vehicleId: string;
  insuranceCompany: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: 'ACTIVE' | 'EXPIRED';
}

// 사고 수리
export interface AccidentRepair {
  id: string;
  vehicleId: string;
  accidentDate: string;
  description: string;
  repairCost: number;
  repairDate?: string;
  status: 'PENDING' | 'IN_REPAIR' | 'COMPLETED';
}

// 차량 경비
export interface VehicleExpense {
  id: string;
  vehicleId: string;
  expenseType: 'FUEL' | 'MAINTENANCE' | 'TOLL' | 'PARKING' | 'OTHER';
  amount: number;
  expenseDate: string;
  description?: string;
}

// 차량 배차 신청
export interface DispatchRequest {
  id: string;
  vehicleId: string;
  requesterId: string;
  requesterName: string;
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  passengerCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
}

// 차량 운행 기록
export interface VehicleOperationLog {
  id: string;
  vehicleId: string;
  driverId: string;
  driverName: string;
  startDate: string;
  endDate: string;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  destination: string;
  purpose: string;
  fuelCost: number;
  tollCost: number;
}

// 센터(시설) 수입
export interface CenterRevenue {
  id: string;
  centerId: string;
  centerName: string;
  revenueDate: string;
  revenueType: string;
  amount: number;
  description?: string;
  createdAt: string;
}

// 주차장 수입
export interface ParkingRevenue {
  id: string;
  parkingLotId: string;
  parkingLotName: string;
  revenueDate: string;
  amount: number;
  vehicleCount: number;
  description?: string;
}

// 센터(시설) 지출
export interface CenterExpense {
  id: string;
  centerId: string;
  centerName: string;
  expenseDate: string;
  expenseType: string;
  amount: number;
  description?: string;
}

// 수지 현황 (수입 - 지출)
export interface BalanceStatus {
  centerId: string;
  centerName: string;
  period: string;
  revenue: number;
  expense: number;
  balance: number;
}

// API 응답
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 페이지네이션
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
