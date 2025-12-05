import { useState, useEffect } from 'react';
import type { PayrollSummary } from '../types/payroll';
import { formatCurrency } from '../lib/utils';

export default function PayrollProcess() {
  const [summaries, setSummaries] = useState<PayrollSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 더미 데이터
    const dummyData: PayrollSummary[] = [
      { paymentMonth: '2025-12', totalEmployees: 150, totalAmount: 450000000, status: 'DRAFT' },
      { paymentMonth: '2025-11', totalEmployees: 148, totalAmount: 445000000, status: 'PAID' },
      { paymentMonth: '2025-10', totalEmployees: 145, totalAmount: 435000000, status: 'PAID' },
    ];
    
    setTimeout(() => {
      setSummaries(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status: PayrollSummary['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">급여 정산 관리</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
          신규 정산 시작
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">귀속월</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대상 인원</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">총 지급액</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaries.map((summary) => (
              <tr key={summary.paymentMonth} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {summary.paymentMonth}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {summary.totalEmployees}명
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {formatCurrency(summary.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(summary.status)}`}>
                    {summary.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {summary.status === 'DRAFT' && (
                    <button className="text-blue-600 hover:text-blue-900 mr-4">계산 실행</button>
                  )}
                  <button className="text-gray-600 hover:text-gray-900">상세 보기</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
