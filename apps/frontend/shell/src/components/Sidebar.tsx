import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/app.store';
import type { MenuItem } from '../types/common';

// 메뉴 아이템 정의
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    path: '/dashboard',
    icon: 'home',
  },
  {
    id: 'system',
    label: '시스템 관리',
    path: '/system',
    icon: 'settings',
    children: [
      { id: 'system-users', label: '사용자 관리', path: '/system/users' },
      { id: 'system-roles', label: '권한 관리', path: '/system/roles' },
      { id: 'system-tenants', label: '테넌트 관리', path: '/system/tenants' },
    ],
  },
  {
    id: 'hr',
    label: '인사 관리',
    path: '/hr',
    icon: 'users',
    children: [
      { id: 'hr-employees', label: '직원 관리', path: '/hr/employees' },
      { id: 'hr-departments', label: '부서 관리', path: '/hr/departments' },
      { id: 'hr-positions', label: '직급 관리', path: '/hr/positions' },
    ],
  },
  {
    id: 'payroll',
    label: '급여 관리',
    path: '/payroll',
    icon: 'dollar',
  },
  {
    id: 'attendance',
    label: '근태 관리',
    path: '/attendance',
    icon: 'clock',
  },
  {
    id: 'budget',
    label: '예산 관리',
    path: '/budget',
    icon: 'chart',
  },
  {
    id: 'treasury',
    label: '자금 관리',
    path: '/treasury',
    icon: 'wallet',
  },
  {
    id: 'accounting',
    label: '회계 관리',
    path: '/accounting',
    icon: 'calculator',
  },
  {
    id: 'asset',
    label: '자산 관리',
    path: '/asset',
    icon: 'box',
  },
  {
    id: 'inventory',
    label: '재고 관리',
    path: '/inventory',
    icon: 'package',
  },
  {
    id: 'general-affairs',
    label: '총무 관리',
    path: '/general-affairs',
    icon: 'briefcase',
  },
];

/**
 * 사이드바 컴포넌트
 * 주요 메뉴 네비게이션을 제공합니다.
 */
export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen } = useAppStore();

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* 사이드바 헤더 */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h2 className="text-lg font-bold">메뉴</h2>
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} currentPath={location.pathname} />
          ))}
        </ul>
      </nav>

      {/* 사이드바 푸터 */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-400 text-center">
          All-ERP v2.0
        </p>
      </div>
    </aside>
  );
}

/**
 * 개별 메뉴 아이템 컴포넌트
 */
function MenuItem({ item, currentPath }: { item: MenuItem; currentPath: string }) {
  const isActive = currentPath.startsWith(item.path);

  return (
    <li>
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <span>{item.label}</span>
      </Link>

      {/* 하위 메뉴 */}
      {item.children && item.children.length > 0 && isActive && (
        <ul className="ml-4 mt-2 space-y-1">
          {item.children.map((child) => {
            const isChildActive = currentPath === child.path;
            return (
              <li key={child.id}>
                <Link
                  to={child.path!}
                  className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                    isChildActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
