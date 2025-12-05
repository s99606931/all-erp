import { useState } from 'react';

export default function BudgetPlan() {
  const [formData, setFormData] = useState({
    fiscalYear: 2026,
    category: 'OPERATING',
    amount: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('예산 편성 신청이 완료되었습니다.');
    // API Call
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">예산 편성 신청</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">회계연도</label>
              <input 
                type="number" 
                value={formData.fiscalYear}
                readOnly
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">예산 항목</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500"
              >
                <option value="OPERATING">운영비</option>
                <option value="Labor">인건비</option>
                <option value="Facility">설비비</option>
                <option value="Marketing">마케팅비</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">신청 금액 (원)</label>
            <input 
              type="number"
              required
              min="0"
              step="10000"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 text-right font-mono"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">편성 사유</label>
            <textarea 
              rows={4}
              required
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500"
              placeholder="예산 증액/신규 편성 사유를 상세히 입력하세요."
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 shadow-md font-medium"
            >
              신청 제출
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
