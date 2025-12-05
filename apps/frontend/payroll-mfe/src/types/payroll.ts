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

// 급여 정산 요약
export interface PayrollSummary {
  paymentMonth: string;
  totalEmployees: number;
  totalAmount: number;
  status: 'DRAFT' | 'CONFIRMED' | 'PAID';
}
