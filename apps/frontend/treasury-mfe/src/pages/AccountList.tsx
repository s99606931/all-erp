import { useState, useEffect } from 'react';
import type { BankAccount } from '../types/treasury';
import { formatCurrency } from '../lib/utils';

export default function AccountList() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    // 더미 데이터
    setAccounts([
      {
        id: '1', bankName: '국민은행', accountNumber: '123-45-67890', accountName: '(주)테스트컴퍼니',
        balance: 850000000, currency: 'KRW', type: 'CHECKING', isActive: true
      },
      {
        id: '2', bankName: '신한은행', accountNumber: '110-222-333333', accountName: '(주)테스트컴퍼니',
        balance: 415000000, currency: 'KRW', type: 'SAVINGS', isActive: true
      },
      {
        id: '3', bankName: 'Woori Bank', accountNumber: '1002-999-888888', accountName: 'TEST COMPANY INC',
        balance: 50000, currency: 'USD', type: 'CHECKING', isActive: true
      }
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">법인 계좌 관리</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
          + 계좌 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                  {acc.bankName.substring(0, 1)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{acc.bankName}</h3>
                  <span className="text-xs text-gray-500">{acc.type}</span>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${acc.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">계좌번호</div>
              <div className="font-mono text-gray-800 tracking-wider">{acc.accountNumber}</div>
            </div>

            <div className="border-t pt-4">
              <div className="text-sm text-gray-500 mb-1">현재 잔액</div>
              <div className="text-xl font-bold text-blue-700">
                {acc.currency === 'KRW' ? formatCurrency(acc.balance) : `$${acc.balance.toLocaleString()}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
