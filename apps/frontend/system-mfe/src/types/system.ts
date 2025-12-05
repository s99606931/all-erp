// 사용자 정보 (from Auth Service)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'MANAGER';
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 공통 코드 (from System Service)
export interface CommonCode {
  id: string;
  groupCode: string;
  code: string;
  value: string;
  order: number;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 부서 정보 (from System Service)
export interface Department {
  id: string;
  code: string;
  name: string;
  parentId?: string | null;
  parentName?: string;
  order: number;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 시스템 설정 (from System Service)
export interface SystemSetting {
  id: string;
  key: string;
  value: string; // JSON string
  category: string;
  tenantId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// API 응답 공통
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
