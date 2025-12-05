import { useState, useEffect } from 'react';
import type { JournalEntry } from '../types/accounting';
import { formatCurrency } from '../lib/utils';

export default function SlipList() {
  const [slips, setSlips] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 더미 데이터
    const dummy: JournalEntry[] = [
      {
        id: '1', entryDate: '2025-12-05', description: '사무용품 구입 (법인카드)',
        status: 'POSTED', tenantId: 't1', createdAt: '', updatedAt: '',
        lines: [
          { id: 'l1', entryId: '1', accountId: 'a1', accountName: '소모품비', debit: 55000, credit: 0, description: '볼펜 외' },
          { id: 'l2', entryId: '1', accountId: 'a2', accountName: '미지급금', debit: 0, credit: 55000, description: '삼성카드' },
        ]
      },
      {
        id: '2', entryDate: '2025-12-05', description: '12월 급여 지급',
        status: 'DRAFT', tenantId: 't1', createdAt: '', updatedAt: '',
        lines: [
          { id: 'l3', entryId: '2', accountId: 'a3', accountName: '급여', debit: 45000000, credit: 0 },
          { id: 'l4', entryId: '2', accountId: 'a4', accountName: '보통예금', debit: 0, credit: 41000000 },
          { id: 'l5', entryId: '2', accountId: 'a5', accountName: '예수금', debit: 0, credit: 4000000 },
        ]
      }
    ];

    // 합계 계산
    const processed = dummy.map(slip => ({
      ...slip,
      totalDebit: slip.lines.reduce((sum, line) => sum + line.debit, 0),
      totalCredit: slip.lines.reduce((sum, line) => sum + line.credit, 0),
    }));

    setTimeout(() => {
      setSlips(processed);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">전표 관리</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
          + 전표 입력
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">일자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">적요</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">차변 총액</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">대변 총액</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {slips.map((slip) => (
              <tr key={slip.id} className="hover:bg-gray-50 group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {slip.entryDate}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="font-medium">{slip.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {slip.lines.map(l => l.accountName).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-blue-600">
                  {formatCurrency(slip.totalDebit || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                  {formatCurrency(slip.totalCredit || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    slip.status === 'POSTED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {slip.status === 'POSTED' ? '승인완료' : '작성중'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900">수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
