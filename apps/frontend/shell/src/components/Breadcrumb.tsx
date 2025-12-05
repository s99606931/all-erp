import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import type { BreadcrumbItem } from '../types/common';

// 경로명을 한글 라벨로 매핑
const pathToLabel: Record<string, string> = {
  dashboard: '대시보드',
  system: '시스템 관리',
  users: '사용자 관리',
  roles: '권한 관리',
  tenants: '테넌트 관리',
  hr: '인사 관리',
  employees: '직원 관리',
  departments: '부서 관리',
  positions: '직급 관리',
  payroll: '급여 관리',
  attendance: '근태 관리',
  budget: '예산 관리',
  treasury: '자금 관리',
  accounting: '회계 관리',
  asset: '자산 관리',
  inventory: '재고 관리',
  'general-affairs': '총무 관리',
};

/**
 * Breadcrumb 컴포넌트
 * 현재 경로를 표시하여 사용자가 앱 내 위치를 파악할 수 있게 합니다.
 */
export default function Breadcrumb() {
  const location = useLocation();

  // 현재 경로를 기반으로 breadcrumb 아이템 생성
  const breadcrumbItems = useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [
      { label: '홈', path: '/' },
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      items.push({
        label: pathToLabel[path] || path,
        path: currentPath,
      });
    });

    return items;
  }, [location.pathname]);

  // 홈 경로는 breadcrumb을 표시하지 않음
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <nav className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <div key={item.path} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {isLast ? (
                <span className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <Link
                  to={item.path!}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
