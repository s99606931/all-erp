import { useState, useEffect } from 'react';
import type { FinancialItem } from '../types/accounting';
import { formatCurrency } from '../lib/utils';

export default function FinancialStatements() {
  const [activeTab, setActiveTab] = useState<'IS' | 'BS'>('IS');
  const [items, setItems] = useState<FinancialItem[]>([]);

  useEffect(() => {
    // 더미 데이터 (손익계산서)
    const isData: FinancialItem[] = [
      { accountName: 'Ⅰ. 매출액', accountCode: '1000', amount: 1500000000, level: 0 },
      { accountName: 'Ⅱ. 매출원가', accountCode: '2000', amount: 800000000, level: 0 },
      { accountName: 'Ⅲ. 매출총이익', accountCode: '3000', amount: 700000000, level: 0 },
      { accountName: 'Ⅳ. 판매비와관리비', accountCode: '4000', amount: 200000000, level: 0 },
      { accountName: '1. 급여', accountCode: '4100', amount: 100000000, level: 1 },
      { accountName: '2. 임차료', accountCode: '4200', amount: 50000000, level: 1 },
      { accountName: '3. 복리후생비', accountCode: '4300', amount: 50000000, level: 1 },
      { accountName: 'Ⅴ. 영업이익', accountCode: '5000', amount: 500000000, level: 0 },
    ];
    
    // 더미 데이터 (대차대조표) - 생략 가능하나 구조상 동일
    const bsData: FinancialItem[] = [
      { accountName: '자산', accountCode: '1000', amount: 2000000000, level: 0 },
      { accountName: '부채', accountCode: '2000', amount: 800000000, level: 0 },
      { accountName: '자본', accountCode: '3000', amount: 1200000000, level: 0 },
    ];

    setItems(activeTab === 'IS' ? isData : bsData);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">재무제표 조회</h2>
        <div className="flex bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => setActiveTab('IS')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'IS' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            손익계산서
          </button>
          <button
            onClick={() => setActiveTab('BS')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'BS' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            대차대조표
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 text-center">
          <h3 className="text-lg font-bold text-gray-800">
            {activeTab === 'IS' ? '2025년 손익계산서' : '2025년 12월 31일 현재 재무상태표'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">(단위: 원)</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-2/3">과목</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-1/3">금액</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, idx) => (
              <tr key={idx} className={`${item.level === 0 ? 'bg-gray-50 font-bold' : ''}`}>
                <td className="px-6 py-3 text-sm text-gray-900">
                  <div style={{ paddingLeft: `${item.level * 20}px` }}>
                    {item.accountName}
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-right font-mono">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
