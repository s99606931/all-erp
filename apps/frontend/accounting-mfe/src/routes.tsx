import { Routes, Route, Navigate } from 'react-router-dom';
import SlipList from './pages/SlipList';
import FinancialStatements from './pages/FinancialStatements';

/**
 * Accounting MFE 라우트 설정
 * Shell 앱에서 /accounting/* 경로로 마운트됩니다.
 */
export default function AccountingRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="slips" replace />} />
      
      {/* 전표 관리 */}
      <Route path="slips" element={<SlipList />} />
      
      {/* 재무제표 / 리포트 */}
      <Route path="reports" element={<FinancialStatements />} />
      
      {/* 계정과목 관리 (TODO) */}
      <Route path="accounts" element={<div>계정과목 관리 (TODO)</div>} />
    </Routes>
  );
}
