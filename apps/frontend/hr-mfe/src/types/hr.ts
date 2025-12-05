// 직원 정보
export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName?: string;
  positionId: string;
  positionName?: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'leave';
  createdAt: string;
  updatedAt: string;
}

// 부서 정보
export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  managerId?: string;
  managerName?: string;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

// 직급 정보
export interface Position {
  id: string;
  code: string;
  name: string;
  level: number;
  description?: string;
  salaryGrade?: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션
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
