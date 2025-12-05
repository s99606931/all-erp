// 계정 과목
export interface AccountCode {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  parentId?: string;
  isActive: boolean;
}

// 전표 (분개)
export interface JournalEntry {
  id: string;
  entryDate: string; // YYYY-MM-DD
  description: string;
  lines: JournalEntryLine[];
  totalDebit?: number; // UI 계산용
  totalCredit?: number; // UI 계산용
  status: 'DRAFT' | 'POSTED'; // 임시저장, 전기됨
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// 전표 상세 라인
export interface JournalEntryLine {
  id: string;
  entryId: string;
  accountId: string;
  accountName?: string; // 조인된 정보
  debit: number; // 차변
  credit: number; // 대변
  description?: string; // 라인별 적요
}

// 재무제표 항목 (B/S, I/S)
export interface FinancialItem {
  accountName: string;
  accountCode: string;
  amount: number;
  level: number; // 들여쓰기 레벨
}
