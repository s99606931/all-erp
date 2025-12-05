// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  roles: string[];
  tenantId: string;
  createdAt: string;
}

// 메뉴 아이템 타입
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  requiredRoles?: string[];
}

// 네비게이션 경로 타입
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션 타입
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}
