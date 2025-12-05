import { Routes, Route, Navigate } from 'react-router-dom';
import PayrollProcess from './pages/PayrollProcess';

/**
 * Payroll MFE 라우트 설정
 * Shell 앱에서 /payroll/* 경로로 마운트됩니다.
 */
export default function PayrollRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="process" replace />} />
      
      {/* 급여 정산 관리 */}
      <Route path="process" element={<PayrollProcess />} />
      
      {/* 급여 내역 조회 (개인별) */}
      <Route path="history" element={<div>급여 내역 조회 페이지 (TODO)</div>} />
      
      {/* 세무 신고 관리 */}
      <Route path="tax" element={<div>원천세 신고 관리 (TODO)</div>} />
    </Routes>
  );
}
