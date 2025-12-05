import { useState, useEffect } from 'react';
import type { Employee } from '../types/hr';
import { formatDate } from '../lib/utils';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 데이터 로드 (임시 더미 데이터 사용)
  useEffect(() => {
    // 실제 API 연동 전 UI 테스트를 위한 더미 데이터
    const dummyData: Employee[] = [
      {
        id: '1',
        userId: 'user1',
        employeeNumber: 'EMP001',
        name: '김철수',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        departmentId: 'dept1',
        departmentName: '개발팀',
        positionCode: 'POS_SENIOR',
        positionName: '선임',
        hireDate: '2023-01-01',
        status: 'ACTIVE',
        tenantId: 'tenant1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: 'user2',
        employeeNumber: 'EMP002',
        name: '이영희',
        email: 'lee@example.com',
        phone: '010-9876-5432',
        departmentId: 'dept2',
        departmentName: '인사팀',
        positionCode: 'POS_JUNIOR',
        positionName: '주임',
        hireDate: '2023-03-15',
        status: 'ACTIVE',
        tenantId: 'tenant1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setTimeout(() => {
      setEmployees(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">직원 관리</h2>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="이름 또는 사번 검색" 
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            신규 직원 등록
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사번</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직급</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">입사일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employee.employeeNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.departmentName || employee.departmentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.positionName || employee.positionCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(employee.hireDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : employee.status === 'RESIGNED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status === 'ACTIVE' ? '재직' : employee.status === 'RESIGNED' ? '퇴사' : '휴직'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">상세</button>
                  <button className="text-gray-600 hover:text-gray-900">수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
