import { Routes, Route, Navigate } from 'react-router-dom';
import CashFlowDashboard from './pages/CashFlowDashboard';
import AccountList from './pages/AccountList';

/**
 * Treasury MFE 라우트 설정
 * Shell 앱에서 /treasury/* 경로로 마운트됩니다.
 */
export default function TreasuryRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="flow" replace />} />
      
      {/* 자금 흐름 (시재) */}
      <Route path="flow" element={<CashFlowDashboard />} />
      
      {/* 계좌 관리 */}
      <Route path="accounts" element={<AccountList />} />
      
      {/* 자금 이체 (TODO) */}
      <Route path="transfer" element={<div>자금 이체 요청 (TODO)</div>} />
      
      {/* 법인카드 (TODO) */}
      <Route path="cards" element={<div>법인카드 관리 (TODO)</div>} />
    </Routes>
  );
}
