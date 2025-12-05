import { Routes, Route, Navigate } from 'react-router-dom';
import UserList from './pages/UserList';
import CodeList from './pages/CodeList';

/**
 * System MFE 라우트 설정
 * Shell 앱에서 /system/* 경로로 마운트됩니다.
 */
export default function SystemRoutes() {
  return (
    <Routes>
      {/* 기본 경로는 사용자 관리로 리다이렉트 */}
      <Route index element={<Navigate to="users" replace />} />
      
      {/* 사용자 관리 */}
      <Route path="users" element={<UserList />} />
      <Route path="users/:id" element={<div>사용자 상세 페이지</div>} />
      
      {/* 공통 코드 관리 */}
      <Route path="codes" element={<CodeList />} />
      
      {/* 권한 관리 (TODO) */}
      <Route path="roles" element={<div>권한 관리 페이지</div>} />
      
      {/* 메뉴 관리 (TODO) */}
      <Route path="menus" element={<div>메뉴 관리 페이지</div>} />
    </Routes>
  );
}
