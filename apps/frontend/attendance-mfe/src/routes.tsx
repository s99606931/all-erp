import { Routes, Route, Navigate } from 'react-router-dom';
import MyAttendance from './pages/MyAttendance';
import LeaveRequestList from './pages/LeaveRequestList';

/**
 * Attendance MFE 라우트 설정
 * Shell 앱에서 /attendance/* 경로로 마운트됩니다.
 */
export default function AttendanceRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="my" replace />} />
      
      {/* 나의 근태 */}
      <Route path="my" element={<MyAttendance />} />
      
      {/* 휴가 신청 */}
      <Route path="leaves" element={<LeaveRequestList />} />
      
      {/* 근태 승인 (관리자) */}
      <Route path="approvals" element={<div>근태 승인 대기 목록 (TODO)</div>} />
      
      {/* 팀 근태 현황 */}
      <Route path="team" element={<div>부서 근태 조회 (TODO)</div>} />
    </Routes>
  );
}
