import { useState, useEffect } from 'react';
import type { LeaveRequest, LeaveSummary } from '../types/attendance';

export default function LeaveRequestList() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [summary, setSummary] = useState<LeaveSummary>({ annualTotal: 15, annualUsed: 3.5, annualRemaining: 11.5 });
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  
  // 폼 상태
  const [formData, setFormData] = useState({
    type: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    // 더미 데이터
    setRequests([
      {
        id: '1', employeeId: 'me', leaveType: 'ANNUAL', 
        startDate: '2025-12-24', endDate: '2025-12-24', days: 1, reason: '크리스마스 이브',
        status: 'APPROVED', tenantId: 't1', createdAt: '', updatedAt: ''
      },
      {
        id: '2', employeeId: 'me', leaveType: 'SICK', 
        startDate: '2025-11-10', endDate: '2025-11-10', days: 0.5, reason: '병원 진료',
        status: 'APPROVED', tenantId: 't1', createdAt: '', updatedAt: ''
      }
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('휴가 신청이 완료되었습니다. (결재 대기)');
    setActiveTab('list');
    // 실제로는 API 호출 후 목록 갱신
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-sm text-blue-600 font-bold mb-1">총 연차</div>
          <div className="text-2xl font-bold text-gray-800">{summary.annualTotal}일</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-sm text-orange-600 font-bold mb-1">사용 연차</div>
          <div className="text-2xl font-bold text-gray-800">{summary.annualUsed}일</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-sm text-green-600 font-bold mb-1">잔여 연차</div>
          <div className="text-2xl font-bold text-gray-800">{summary.annualRemaining}일</div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('list')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'list' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              신청 내역
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'form' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              휴가 신청
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'list' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">일수</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사유</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.leaveType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.startDate} ~ {req.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.days}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700">휴가 유형</label>
                <select 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="ANNUAL">연차</option>
                  <option value="SICK">병가</option>
                  <option value="PERSONAL">경조사</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">시작일</label>
                  <input type="date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">종료일</label>
                  <input type="date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">사유</label>
                <textarea 
                  rows={3} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 sm:text-sm"
                  placeholder="휴가 사유를 입력하세요"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                휴가 신청하기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
