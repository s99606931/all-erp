import { test, expect } from '@playwright/test';

/**
 * 대시보드 E2E 테스트
 * 
 * 메인 대시보드 페이지의 렌더링 및 데이터 로딩을 검증합니다.
 */
test.describe('대시보드', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('대시보드 메인 위젯 표시', async ({ page }) => {
    // 대시보드 위젯들이 표시되는지 확인
    await expect(page.locator('[data-testid="widget-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="widget-recent-activities"]')).toBeVisible();
  });

  test('대시보드 통계 데이터 로딩', async ({ page }) => {
    // 통계 카드들이 데이터를 로드하는지 확인
    const statsCards = page.locator('[data-testid^="stat-card-"]');
    await expect(statsCards.first()).toBeVisible();
    
    // 로딩 스피너가 사라지고 실제 데이터가 표시되는지 확인
    await expect(page.locator('.loading-spinner')).not.toBeVisible({ timeout: 10000 });
  });

  test('대시보드에서 빠른 액션 수행', async ({ page }) => {
    // 빠른 액션 버튼 클릭
    await page.click('[data-testid="quick-action-new-employee"]');
    await expect(page).toHaveURL('/hr/employees/new');
  });
});
