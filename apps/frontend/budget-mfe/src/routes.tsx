import { Routes, Route, Navigate } from 'react-router-dom';
import BudgetDashboard from './pages/BudgetDashboard';
import BudgetPlan from './pages/BudgetPlan';

/**
 * Budget MFE 라우트 설정
 * Shell 앱에서 /budget/* 경로로 마운트됩니다.
 */
export default function BudgetRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* 예산 현황 대시보드 */}
      <Route path="dashboard" element={<BudgetDashboard />} />
      
      {/* 예산 편성 신청 */}
      <Route path="plan" element={<BudgetPlan />} />
      
      {/* 예산 분석 (TODO) */}
      <Route path="analysis" element={<div>예산 대비 실적 분석 (TODO)</div>} />
    </Routes>
  );
}
