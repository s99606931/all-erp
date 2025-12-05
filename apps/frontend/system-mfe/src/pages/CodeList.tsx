import { useState, useEffect } from 'react';
import type { CommonCode } from '../types/system';

export default function CodeList() {
  const [codes, setCodes] = useState<CommonCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  useEffect(() => {
    // 더미 데이터
    const dummyData: CommonCode[] = [
      { id: '1', groupCode: 'POS_CODE', code: 'POS_SENIOR', value: '선임', order: 1, tenantId: 't1', isActive: true, createdAt: '', updatedAt: '' },
      { id: '2', groupCode: 'POS_CODE', code: 'POS_JUNIOR', value: '주임', order: 2, tenantId: 't1', isActive: true, createdAt: '', updatedAt: '' },
      { id: '3', groupCode: 'DEPT_TYPE', code: 'DEV', value: '개발', order: 1, tenantId: 't1', isActive: true, createdAt: '', updatedAt: '' },
      { id: '4', groupCode: 'DEPT_TYPE', code: 'HR', value: '인사', order: 2, tenantId: 't1', isActive: true, createdAt: '', updatedAt: '' },
    ];

    setTimeout(() => {
      setCodes(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  const uniqueGroups = Array.from(new Set(codes.map(c => c.groupCode)));
  const filteredCodes = selectedGroup === 'ALL' ? codes : codes.filter(c => c.groupCode === selectedGroup);

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">공통 코드 관리</h2>
        <div className="flex space-x-2">
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="ALL">전체 그룹</option>
            {uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            코드 추가
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCodes.map((code) => (
          <div key={code.id} className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">{code.groupCode}</span>
              <span className={`px-2 py-1 rounded text-xs ${code.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {code.isActive ? '사용중' : '미사용'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{code.value}</h3>
            <p className="text-sm text-gray-500 font-mono mb-4">{code.code}</p>
            <div className="text-sm text-gray-400">순서: {code.order}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
