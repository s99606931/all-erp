import { useAuthStore } from '../store/auth.store';
import { useAppStore } from '../store/app.store';

/**
 * 헤더 컴포넌트
 * 사용자 정보, 알림, 설정 등을 표시합니다.
 */
export default function Header() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useAppStore();

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* 사이드바 토글 버튼 */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="사이드바 토글"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* 로고 */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800">All-ERP</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* 알림 아이콘 */}
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          aria-label="알림"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* 사용자 정보 */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {user?.displayName || '사용자'}
            </p>
            <p className="text-xs text-gray-500">{user?.email || ''}</p>
          </div>

          {/* 사용자 아바타 */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.displayName?.charAt(0) || 'U'}
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="로그아웃"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
