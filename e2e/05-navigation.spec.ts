import { test, expect } from '@playwright/test';

/**
 * 네비게이션 E2E 테스트
 * 
 * 사이드바 메뉴, 브레드크럼, 페이지 이동을 검증합니다.
 */
test.describe('네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('사이드바 메뉴 토글', async ({ page }) => {
    // 사이드바 축소/확장
    const sidebar = page.locator('[data-testid="sidebar"]');
    const toggleBtn = page.locator('[data-testid="sidebar-toggle"]');

    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/collapsed/);

    await toggleBtn.click();
    await expect(sidebar).not.toHaveClass(/collapsed/);
  });

  test('HR 메뉴 네비게이션', async ({ page }) => {
    // HR 메뉴 펼치기
    await page.click('[data-testid="menu-hr"]');
    
    // 직원 관리 페이지로 이동
    await page.click('[data-testid="menu-hr-employees"]');
    await expect(page).toHaveURL('/hr/employees');
    
    // 브레드크럼 확인
    await expect(page.locator('[data-testid="breadcrumb"]')).toContainText('인사 관리');
    await expect(page.locator('[data-testid="breadcrumb"]')).toContainText('직원 목록');
  });

  test('급여 메뉴 네비게이션', async ({ page }) => {
    await page.click('[data-testid="menu-payroll"]');
    await page.click('[data-testid="menu-payroll-process"]');
    await expect(page).toHaveURL('/payroll/process');
  });

  test('회계 메뉴 네비게이션', async ({ page }) => {
    await page.click('[data-testid="menu-accounting"]');
    await page.click('[data-testid="menu-accounting-vouchers"]');
    await expect(page).toHaveURL('/accounting/vouchers');
  });

  test('뒤로가기/앞으로가기', async ({ page }) => {
    // 페이지 이동
    await page.click('[data-testid="menu-hr"]');
    await page.click('[data-testid="menu-hr-employees"]');
    await expect(page).toHaveURL('/hr/employees');

    // 대시보드로 이동
    await page.click('[data-testid="menu-dashboard"]');
    await expect(page).toHaveURL('/dashboard');

    // 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL('/hr/employees');

    // 앞으로가기
    await page.goForward();
    await expect(page).toHaveURL('/dashboard');
  });
});
