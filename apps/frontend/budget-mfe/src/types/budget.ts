// 예산 정보
export interface Budget {
  id: string;
  departmentId: string;
  departmentName?: string; // UI용 확장 필드
  category: string; // 인건비, 운영비, 설비비 등
  fiscalYear: number;
  amount: number; // 예산 배정액
  spent: number;  // 집행액
  remaining?: number; // 잔액 (UI 계산)
  usageRate?: number; // 집행률 (UI 계산)
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// 예산 신청 정보 (가상)
export interface BudgetRequest {
  id: string;
  departmentId: string;
  category: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestYear: number;
}
