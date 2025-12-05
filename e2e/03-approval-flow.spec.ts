import { test, expect } from '@playwright/test';

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
