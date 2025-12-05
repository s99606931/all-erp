import { useState, useEffect } from 'react';
import type { Budget } from '../types/budget';
import { formatCurrency } from '../lib/utils';

export default function BudgetDashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // 더미 데이터 생성
    const dummy: Budget[] = [
      {
        id: '1', departmentId: 'dept1', departmentName: '개발팀', category: '인건비',
        fiscalYear: 2025, amount: 500000000, spent: 450000000, tenantId: 't1',
        createdAt: '', updatedAt: ''
      },
      {
        id: '2', departmentId: 'dept1', departmentName: '개발팀', category: '장비구입비',
        fiscalYear: 2025, amount: 50000000, spent: 20000000, tenantId: 't1',
        createdAt: '', updatedAt: ''
      },
      {
        id: '3', departmentId: 'dept2', departmentName: '인사팀', category: '운영비',
        fiscalYear: 2025, amount: 20000000, spent: 18000000, tenantId: 't1',
        createdAt: '', updatedAt: ''
      },
    ];

    // 계산 필드 추가
    const processed = dummy.map(b => ({
      ...b,
      remaining: b.amount - b.spent,
      usageRate: (b.spent / b.amount) * 100
    }));

    setBudgets(processed);
  }, [fiscalYear]);

  // 부서별 Grouping
  const deptBudgets = budgets.reduce((acc, curr) => {
    const dept = curr.departmentName || 'Unknown';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(curr);
    return acc;
  }, {} as Record<string, Budget[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{fiscalYear}년 예산 집행 현황</h2>
        <select 
          value={fiscalYear}
          onChange={(e) => setFiscalYear(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value={2025}>2025년</option>
          <option value={2024}>2024년</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(deptBudgets).map(([deptName, items]) => (
          <div key={deptName} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{deptName}</h3>
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.category}</span>
                    <span className="text-gray-500">
                      {formatCurrency(item.spent)} / {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                        (item.usageRate || 0) > 90 ? 'bg-red-500' : 
                        (item.usageRate || 0) > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(item.usageRate || 0, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-1 text-xs font-bold">
                    <span className={`${(item.usageRate || 0) > 90 ? 'text-red-600' : 'text-blue-600'}`}>
                      {item.usageRate?.toFixed(1)}% 사용
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
