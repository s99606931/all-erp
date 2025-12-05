import { useState, useEffect } from 'react';
import type { Payroll } from '../types/hr';
import { formatCurrency, formatDate } from '../lib/utils';

export default function PayrollList() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    // 더미 데이터
    const dummyData: Payroll[] = [
      {
        id: '1',
        employeeId: 'emp1',
        employeeName: '김철수',
        paymentMonth: selectedMonth,
        baseSalary: 5000000,
        totalAllowance: 200000,
        totalDeduction: 500000,
        netPay: 4700000,
        status: 'PAID',
        paidAt: `${selectedMonth}-25T10:00:00`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        employeeId: 'emp2',
        employeeName: '이영희',
        paymentMonth: selectedMonth,
        baseSalary: 4000000,
        totalAllowance: 100000,
        totalDeduction: 400000,
        netPay: 3700000,
        status: 'PAID',
        paidAt: `${selectedMonth}-25T10:00:00`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        employeeId: 'emp3',
        employeeName: '박지성',
        paymentMonth: selectedMonth,
        baseSalary: 6000000,
        totalAllowance: 300000,
        totalDeduction: 600000,
        netPay: 5700000,
        status: 'CONFIRMED',
        paidAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setLoading(true);
    setTimeout(() => {
      setPayrolls(dummyData);
      setLoading(false);
    }, 500);
  }, [selectedMonth]);

  const getStatusBadge = (status: Payroll['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Payroll['status']) => {
    switch (status) {
      case 'DRAFT': return '작성중';
      case 'CONFIRMED': return '확정';
      case 'PAID': return '지급완료';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">급여 대장</h2>
        <div className="flex space-x-2">
          <input 
            type="month"
            className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            급여 계산 실행
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">기본급</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">수당총액</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">공제총액</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">실수령액</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">지급일</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payroll.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatCurrency(payroll.baseSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatCurrency(payroll.totalAllowance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-500">
                      -{formatCurrency(payroll.totalDeduction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(payroll.netPay)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(payroll.status)}`}>
                        {getStatusText(payroll.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {payroll.paidAt ? formatDate(payroll.paidAt) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">명세서</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
