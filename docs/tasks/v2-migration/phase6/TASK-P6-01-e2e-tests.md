# TASK-P6-01: E2E 테스트

## 📋 작업 개요
- **Phase**: Phase 6 (통합 테스트 및 최적화)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P5-11 (모든 Micro Frontend 완료)

## 🎯 목표

17개 백엔드 서비스와 11개 프론트엔드 앱을 대상으로 End-to-End 테스트를 구축하여 전체 시스템의 통합을 검증합니다.

## 📝 상세 작업 내용

### 1. Playwright 설정

**설치**:
```bash
pnpm add -D @playwright/test
pnpm exec playwright install
```

**playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### 2. 핵심 시나리오 테스트

**e2e/01-auth-flow.spec.ts** (인증 흐름):
```typescript
import { test, expect } from '@playwright/test';

test.describe('인증 흐름', () => {
  test('로그인 성공', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=환영합니다')).toBeVisible();
  });

  test('로그아웃 성공', async ({ page }) => {
    // 로그인 후
    await page.goto('/dashboard');
    await page.click('button:has-text("로그아웃")');

    await expect(page).toHaveURL('/login');
  });
});
```

**e2e/02-employee-crud.spec.ts** (직원 관리):
```typescript
import { test, expect } from '@playwright/test';

test.describe('직원 관리 (Cross-Service)', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('직원 생성 → 급여 조회', async ({ page }) => {
    // 1. 직원 생성 (personnel-service)
    await page.goto('/hr/employees/new');
    await page.fill('input[name="name"]', '홍길동');
    await page.fill('input[name="email"]', 'hong@example.com');
    await page.selectOption('select[name="departmentId"]', '1');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=직원이 등록되었습니다')).toBeVisible();

    // 2. 급여 조회 (payroll-service에서 employee cache 확인)
    await page.goto('/payroll/employees');
    await expect(page.locator('text=홍길동')).toBeVisible();
  });
});
```

**e2e/03-approval-flow.spec.ts** (결재 흐름):
```typescript
test.describe('결재 흐름 (Multi-Service Saga)', () => {
  test('급여 처리 → 결재 요청 → 승인', async ({ page }) => {
    await page.goto('/payroll/process');
    
    // 1. 급여 처리 제출
    await page.selectOption('select[name="employeeId"]', '1');
    await page.fill('input[name="amount"]', '3000000');
    await page.click('button:has-text("제출")');

    // 2. 결재 요청 확인
    await page.goto('/approval/requests');
    await expect(page.locator('text=급여 처리 결재 요청')).toBeVisible();

    // 3. 결재 승인
    await page.click('button:has-text("승인")');
    await expect(page.locator('text=승인 완료')).toBeVisible();

    // 4. 급여 처리 상태 확인
    await page.goto('/payroll/records');
    await expect(page.locator('text=완료')).toBeVisible();
  });
});
```

### 3. API 통합 테스트

**tests/integration/services.test.ts**:
```typescript
import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('서비스 간 통신 테스트', () => {
  it('personnel → payroll: 직원 생성 이벤트 전파', async () => {
    // 1. personnel-service에서 직원 생성
    const createResponse = await axios.post('http://localhost:3011/api/v1/employees', {
      name: '테스트직원',
      email: 'test@example.com',
      departmentId: 1,
    });

    const employeeId = createResponse.data.id;

    // 2. 이벤트 전파 대기 (1초)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. payroll-service에서 employee cache 확인
    const cacheResponse = await axios.get(`http://localhost:3012/api/v1/employee-cache/${employeeId}`);
    
    expect(cacheResponse.data).toBeDefined();
    expect(cacheResponse.data.name).toBe('테스트직원');
  });
});
```

### 4. 성능 테스트 (부하 테스트)

**k6 스크립트** (`tests/load/approval-flow.js`):
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // 1분 동안 100명까지 증가
    { duration: '3m', target: 100 },  // 3분 동안 100명 유지
    { duration: '1m', target: 0 },    // 1분 동안 0명으로 감소
  ],
};

export default function () {
  // 로그인
  const loginRes = http.post('http://localhost:3001/api/v1/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  });

  const token = loginRes.json('token');

  // 결재 요청 조회
  const approvalRes = http.get('http://localhost:3041/api/v1/approvals', {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(approvalRes, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

## ✅ 완료 조건

- [ ] Playwright E2E 테스트 10개 이상 작성
- [ ] 서비스 간 통신 통합 테스트 5개 이상
- [ ] 주요 비즈니스 흐름 커버리지 80% 이상
- [ ] 성능 테스트 (k6) 스크립트 작성
- [ ] CI/CD 파이프라인에 E2E 테스트 통합
- [ ] 테스트 실행 문서화

## 🔧 실행 명령어

```bash
# Playwright E2E 테스트
pnpm exec playwright test

# 통합 테스트
pnpm test:integration

# 성능 테스트
k6 run tests/load/approval-flow.js

# 테스트 리포트 확인
pnpm exec playwright show-report
```

## 📚 참고 문서

- [Playwright 공식 문서](https://playwright.dev/)
- [k6 공식 문서](https://k6.io/docs/)

## 🚨 주의사항

- E2E 테스트 전 모든 서비스가 실행 중이어야 함
- 테스트 데이터는 별도 테넌트 사용
- 성능 테스트는 운영 환경과 유사한 환경에서 실행
- 이벤트 전파 시간 고려 (비동기)
