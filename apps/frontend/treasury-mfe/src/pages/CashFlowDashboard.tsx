import { useState, useEffect } from 'react';
import type { DailyBalanace, Transaction } from '../types/treasury';
import { formatCurrency, formatDate } from '../lib/utils';

export default function CashFlowDashboard() {
  const [dailySummary, setDailySummary] = useState<DailyBalanace | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // 더미 데이터
    const today = new Date().toISOString().split('T')[0];
    
    setDailySummary({
      date: today,
      prevBalance: 1250000000,
      income: 50000000,
      expense: 35000000,
      currBalance: 1265000000
    });

    setTransactions([
      { 
        id: '1', date: today, type: 'DEPOSIT', category: '제품 매출', 
        amount: 45000000, description: 'A사 납품 대금', accountId: 'acc1', status: 'COMPLETED' 
      },
      { 
        id: '2', date: today, type: 'WITHDRAWAL', category: '운영비', 
        amount: 5000000, description: '사무실 임대료', accountId: 'acc1', status: 'COMPLETED' 
      },
      { 
        id: '3', date: today, type: 'WITHDRAWAL', category: '자재비', 
        amount: 30000000, description: '원자재 구매', accountId: 'acc2', status: 'PENDING' 
      },
    ]);
  }, []);

  if (!dailySummary) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">오늘의 자금 현황 ({formatDate(dailySummary.date)})</h2>
      
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-400">
          <div className="text-gray-500 text-sm">전일 시재</div>
          <div className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(dailySummary.prevBalance)}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-blue-600 text-sm font-bold">금일 수입 (+)</div>
          <div className="text-xl font-bold text-blue-700 mt-1">{formatCurrency(dailySummary.income)}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-red-600 text-sm font-bold">금일 지출 (-)</div>
          <div className="text-xl font-bold text-red-700 mt-1">{formatCurrency(dailySummary.expense)}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-green-600 text-sm font-bold">금일 잔액 (=)</div>
          <div className="text-xl font-bold text-green-700 mt-1">{formatCurrency(dailySummary.currBalance)}</div>
        </div>
      </div>

      {/* 최근 거래 내역 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">실시간 거래 내역</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시간</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">구분</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">적요</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">금액</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">상태</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tx.type === 'DEPOSIT' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tx.type === 'DEPOSIT' ? '입금' : '출금'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{tx.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tx.description}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                    tx.type === 'DEPOSIT' ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
