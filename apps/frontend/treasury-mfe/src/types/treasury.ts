// 은행 계좌 정보
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string; // 예금주
  balance: number; // 현재 잔액
  currency: string; // KRW, USD
  type: 'SAVINGS' | 'CHECKING' | 'FIXED_DEPOSIT'; // 예금, 당좌, 적금
  isActive: boolean;
}

// 자금 거래 내역 (Cash Flow)
export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'DEPOSIT' | 'WITHDRAWAL'; // 입금, 출금
  category: string; // 매출입금, 급여지급, 자재비 등
  amount: number;
  description: string;
  accountId: string; // 연결 계좌
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

// 자금 일보 요약
export interface DailyBalanace {
  date: string;
  prevBalance: number; // 전일 시재
  income: number; // 금일 수입
  expense: number; // 금일 지출
  currBalance: number; // 금일 잔액
}
