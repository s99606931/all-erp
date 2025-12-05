import { useState, useEffect } from 'react';
import { formatDate } from '../lib/utils';
import type { Attendance } from '../types/attendance';

export default function MyAttendance() {
  const [today, setToday] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  // 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 더미 데이터 로드
  useEffect(() => {
    // API 호출 시뮬레이션
    setTimeout(() => {
      setAttendances([
        {
          id: '1', employeeId: 'me', date: '2025-12-01', status: 'PRESENT',
          checkIn: '2025-12-01T08:50:00', checkOut: '2025-12-01T18:00:00', workHours: 8,
          tenantId: 't1', createdAt: '', updatedAt: ''
        },
        {
          id: '2', employeeId: 'me', date: '2025-12-02', status: 'LATE',
          checkIn: '2025-12-02T09:10:00', checkOut: '2025-12-02T18:30:00', workHours: 8,
          tenantId: 't1', createdAt: '', updatedAt: ''
        },
      ]);
    }, 500);
  }, []);

  const handleCheckIn = () => {
    // TODO: API Call
    setIsCheckedIn(true);
    setCheckInTime(new Date().toISOString());
    alert('출근 처리되었습니다.');
  };

  const handleCheckOut = () => {
    // TODO: API Call
    setIsCheckedIn(false);
    alert('퇴근 처리되었습니다.');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 출퇴근 카드 */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">오늘의 근태</h2>
          <div className="text-4xl font-mono font-bold text-blue-600 mb-6">
            {formatDate(today, 'HH:mm:ss')}
          </div>
          <div className="text-gray-500 mb-8">{formatDate(today, 'YYYY년 MM월 DD일')}</div>
          
          <div className="space-y-4 w-full px-4">
            {!isCheckedIn ? (
              <button 
                onClick={handleCheckIn}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-bold shadow-md transition-colors"
              >
                출근하기
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">출근시간</span>
                  <div className="font-bold text-lg">{checkInTime ? formatDate(checkInTime, 'HH:mm') : '-'}</div>
                </div>
                <button 
                  onClick={handleCheckOut}
                  className="w-full py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-lg font-bold shadow-md transition-colors"
                >
                  퇴근하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 근태 현황 리스트 */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">이번 달 근태 현황</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">출근</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">퇴근</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendances.map((att) => (
                  <tr key={att.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {att.checkIn ? formatDate(att.checkIn, 'HH:mm') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {att.checkOut ? formatDate(att.checkOut, 'HH:mm') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        att.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
