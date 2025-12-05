/**
 * 서비스별 API 엔드포인트 설정
 * 
 * 환경변수나 서비스 디스커버리로 관리할 수 있지만,
 * 현재는 Docker 네트워크 내부 서비스명을 사용
 */
export const SERVICE_ENDPOINTS = {
  // System Domain
  AUTH_SERVICE: process.env['AUTH_SERVICE_URL'] || 'http://localhost:3001',
  SYSTEM_SERVICE: process.env['SYSTEM_SERVICE_URL'] || 'http://localhost:3002',
  TENANT_SERVICE: process.env['TENANT_SERVICE_URL'] || 'http://localhost:3006',

  // HR Domain
  PERSONNEL_SERVICE: process.env['PERSONNEL_SERVICE_URL'] || 'http://localhost:3011',
  PAYROLL_SERVICE: process.env['PAYROLL_SERVICE_URL'] || 'http://localhost:3012',
  ATTENDANCE_SERVICE: process.env['ATTENDANCE_SERVICE_URL'] || 'http://localhost:3013',

  // Finance Domain
  BUDGET_SERVICE: process.env['BUDGET_SERVICE_URL'] || 'http://localhost:3021',
  ACCOUNTING_SERVICE: process.env['ACCOUNTING_SERVICE_URL'] || 'http://localhost:3022',
  SETTLEMENT_SERVICE: process.env['SETTLEMENT_SERVICE_URL'] || 'http://localhost:3023',

  // General Domain
  ASSET_SERVICE: process.env['ASSET_SERVICE_URL'] || 'http://localhost:3031',
  SUPPLY_SERVICE: process.env['SUPPLY_SERVICE_URL'] || 'http://localhost:3032',
  GENERAL_AFFAIRS_SERVICE: process.env['GENERAL_AFFAIRS_SERVICE_URL'] || 'http://localhost:3033',

  // Platform Domain
  APPROVAL_SERVICE: process.env['APPROVAL_SERVICE_URL'] || 'http://localhost:3050',
  REPORT_SERVICE: process.env['REPORT_SERVICE_URL'] || 'http://localhost:3060',
  NOTIFICATION_SERVICE: process.env['NOTIFICATION_SERVICE_URL'] || 'http://localhost:3070',
  FILE_SERVICE: process.env['FILE_SERVICE_URL'] || 'http://localhost:3080',

  // AI Domain
  AI_SERVICE: process.env['AI_SERVICE_URL'] || 'http://localhost:3007',
} as const;

/**
 * API 버전
 */
export const API_VERSION = 'v1';

/**
 * 서비스별 기본 API 경로 생성
 */
export const getServiceApiPath = (service: keyof typeof SERVICE_ENDPOINTS, path: string) => {
  const baseUrl = SERVICE_ENDPOINTS[service];
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/api/${API_VERSION}${cleanPath}`;
};
