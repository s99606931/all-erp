import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios, { AxiosInstance } from 'axios';

/**
 * 서비스 간 통신 통합 테스트
 * 
 * 이 테스트는 마이크로서비스 간의 API 통신과 이벤트 전파를 검증합니다.
 * 테스트 실행 전에 모든 관련 서비스가 Docker Compose를 통해 실행 중이어야 합니다.
 */

// 서비스 URL 설정
const SERVICE_URLS = {
  auth: 'http://localhost:3001',
  personnel: 'http://localhost:3011',
  payroll: 'http://localhost:3012',
  approval: 'http://localhost:3041',
  organization: 'http://localhost:3014',
};

// 테스트용 인증 토큰 저장
let authToken: string;
let apiClient: AxiosInstance;

describe('서비스 간 통신 테스트', () => {
  beforeAll(async () => {
    // 테스트 시작 전 로그인하여 토큰 획득
    try {
      const loginResponse = await axios.post(`${SERVICE_URLS.auth}/api/v1/auth/login`, {
        email: 'admin@example.com',
        password: 'password123',
      });
      authToken = loginResponse.data.token;
      
      // 인증된 API 클라이언트 생성
      apiClient = axios.create({
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (error) {
      console.warn('인증 서비스 연결 실패, 테스트를 건너뜁니다.');
    }
  });

  afterAll(async () => {
    // 테스트 후 정리 작업 (필요 시)
  });

  it('personnel → payroll: 직원 생성 이벤트 전파', async () => {
    // 1. personnel-service에서 직원 생성
    const createResponse = await apiClient.post(`${SERVICE_URLS.personnel}/api/v1/employees`, {
      name: '테스트직원',
      email: `test-${Date.now()}@example.com`,
      departmentId: 1,
    });

    expect(createResponse.status).toBe(201);
    const employeeId = createResponse.data.id;

    // 2. 이벤트 전파 대기 (RabbitMQ를 통한 비동기 처리)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. payroll-service에서 employee cache 확인
    const cacheResponse = await apiClient.get(`${SERVICE_URLS.payroll}/api/v1/employee-cache/${employeeId}`);
    
    expect(cacheResponse.status).toBe(200);
    expect(cacheResponse.data).toBeDefined();
    expect(cacheResponse.data.name).toBe('테스트직원');
  });

  it('auth-service: 토큰 검증', async () => {
    // 유효한 토큰으로 사용자 정보 조회
    const response = await apiClient.get(`${SERVICE_URLS.auth}/api/v1/auth/me`);
    
    expect(response.status).toBe(200);
    expect(response.data.email).toBe('admin@example.com');
  });

  it('organization-service: 부서 목록 조회', async () => {
    const response = await apiClient.get(`${SERVICE_URLS.organization}/api/v1/departments`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('approval-service: 결재 요청 생성 및 조회', async () => {
    // 1. 결재 요청 생성
    const createResponse = await apiClient.post(`${SERVICE_URLS.approval}/api/v1/approvals`, {
      type: 'PAYROLL',
      title: '급여 처리 결재 요청',
      content: '2024년 12월 급여 처리 승인 요청',
      requesterId: 1,
    });

    expect(createResponse.status).toBe(201);
    const approvalId = createResponse.data.id;

    // 2. 결재 요청 조회
    const getResponse = await apiClient.get(`${SERVICE_URLS.approval}/api/v1/approvals/${approvalId}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.title).toBe('급여 처리 결재 요청');
    expect(getResponse.data.status).toBe('PENDING');
  });

  it('payroll → approval: 급여 처리 결재 연동', async () => {
    // 1. 급여 처리 요청 (결재 자동 생성)
    const payrollResponse = await apiClient.post(`${SERVICE_URLS.payroll}/api/v1/payroll/process`, {
      employeeId: 1,
      amount: 3000000,
      period: '2024-12',
    });

    expect(payrollResponse.status).toBe(201);
    const payrollId = payrollResponse.data.id;

    // 2. 이벤트 전파 대기
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. 결재 요청 확인
    const approvalResponse = await apiClient.get(`${SERVICE_URLS.approval}/api/v1/approvals`, {
      params: { referenceType: 'PAYROLL', referenceId: payrollId },
    });

    expect(approvalResponse.status).toBe(200);
    expect(approvalResponse.data.length).toBeGreaterThan(0);
  });
});
