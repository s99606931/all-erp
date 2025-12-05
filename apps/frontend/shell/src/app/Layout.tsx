import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';

/**
 * 메인 레이아웃 컴포넌트
 * Header, Sidebar, Breadcrumb을 포함하고 중앙에 페이지 컨텐츠를 표시합니다.
 */
export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <Header />

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* 페이지 컨텐츠 */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
