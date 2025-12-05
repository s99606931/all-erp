import { useState, useEffect } from 'react';
import type { Department } from '../types/hr';

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyData: Department[] = [
      {
        id: 'dept1',
        code: 'DEV',
        name: '개발팀',
        managerName: '김개발',
        employeeCount: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept2',
        code: 'HR',
        name: '인사팀',
        managerName: '이인사',
        employeeCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept3',
        code: 'SALES',
        name: '영업팀',
        managerName: '박영업',
        employeeCount: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setTimeout(() => {
      setDepartments(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">부서 관리</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          부서 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white shadow rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                <p className="text-sm text-gray-500">Code: {dept.code}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {dept.employeeCount}명
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium mr-2">관리자:</span>
                {dept.managerName || '-'}
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
              <button className="text-sm text-gray-600 hover:text-gray-900">상세</button>
              <button className="text-sm text-blue-600 hover:text-blue-900">수정</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
