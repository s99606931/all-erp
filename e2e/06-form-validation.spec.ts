import { test, expect } from '@playwright/test';

/**
 * 폼 유효성 검사 E2E 테스트
 * 
 * 다양한 입력 폼의 클라이언트/서버 사이드 유효성 검사를 테스트합니다.
 */
test.describe('폼 유효성 검사', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('로그인 폼 유효성 검사', async ({ page }) => {
    // 로그아웃 후 다시 테스트
    await page.goto('/logout');
    await page.goto('/login');

    // 빈 폼 제출
    await page.click('button[type="submit"]');
    await expect(page.locator('text=이메일을 입력해주세요')).toBeVisible();
    await expect(page.locator('text=비밀번호를 입력해주세요')).toBeVisible();

    // 잘못된 이메일 형식
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'pass');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=올바른 이메일 형식이 아닙니다')).toBeVisible();
  });

  test('직원 등록 폼 유효성 검사', async ({ page }) => {
    await page.goto('/hr/employees/new');

    // 빈 폼 제출
    await page.click('button[type="submit"]');
    await expect(page.locator('text=이름을 입력해주세요')).toBeVisible();
    await expect(page.locator('text=이메일을 입력해주세요')).toBeVisible();
    await expect(page.locator('text=부서를 선택해주세요')).toBeVisible();

    // 중복 이메일 검사 (서버 사이드)
    await page.fill('input[name="name"]', '테스트');
    await page.fill('input[name="email"]', 'admin@example.com'); // 이미 존재하는 이메일
    await page.selectOption('select[name="departmentId"]', '1');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=이미 사용 중인 이메일입니다')).toBeVisible();
  });

  test('급여 입력 폼 숫자 유효성 검사', async ({ page }) => {
    await page.goto('/payroll/process');

    await page.selectOption('select[name="employeeId"]', '1');
    
    // 음수 입력 시도
    await page.fill('input[name="amount"]', '-100000');
    await page.click('button:has-text("제출")');
    await expect(page.locator('text=금액은 0보다 커야 합니다')).toBeVisible();

    // 최대값 초과
    await page.fill('input[name="amount"]', '999999999999');
    await page.click('button:has-text("제출")');
    await expect(page.locator('text=금액이 너무 큽니다')).toBeVisible();
  });

  test('날짜 입력 유효성 검사', async ({ page }) => {
    await page.goto('/hr/attendance/record');

    // 미래 날짜 입력 시도
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    await page.fill('input[name="date"]', futureDateStr);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=미래 날짜는 선택할 수 없습니다')).toBeVisible();
  });
});
