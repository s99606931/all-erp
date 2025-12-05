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
