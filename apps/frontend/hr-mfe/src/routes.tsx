import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import DepartmentList from './pages/DepartmentList';
import PositionList from './pages/PositionList';
import AttendanceList from './pages/AttendanceList';
import PayrollList from './pages/PayrollList';

/**
 * HR MFE 라우트 설정
 * Shell 앱에서 /hr/* 경로로 마운트됩니다.
 */
export default function HrRoutes() {
  return (
    <Routes>
      {/* 기본 경로는 직원 관리 리스트로 리다이렉트 */}
      <Route index element={<Navigate to="employees" replace />} />
      
      {/* 직원 관리 */}
      <Route path="employees" element={<EmployeeList />} />
      <Route path="employees/new" element={<EmployeeForm />} />
      <Route path="employees/:id" element={<div>직원 상세 페이지</div>} />
      
      {/* 근태 관리 */}
      <Route path="attendance" element={<AttendanceList />} />
      
      {/* 급여 관리 */}
      <Route path="payroll" element={<PayrollList />} />
      
      {/* 부서 관리 */}
      <Route path="departments" element={<DepartmentList />} />
      <Route path="departments/new" element={<div>부서 등록 페이지</div>} />
      <Route path="departments/:id" element={<div>부서 상세 페이지</div>} />
      
      {/* 직급 관리 */}
      <Route path="positions" element={<PositionList />} />
      <Route path="positions/new" element={<div>직급 등록 페이지</div>} />
      
      {/* 그 외 경로는 404 처리 (Shell에서 처리됨) */}
    </Routes>
  );
}
