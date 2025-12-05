import { test, expect } from '@playwright/test';

/**
 * 에러 처리 E2E 테스트
 * 
 * API 오류, 네트워크 오류, 권한 오류 등 다양한 에러 상황을 검증합니다.
 */
test.describe('에러 처리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('404 페이지 표시', async ({ page }) => {
    await page.goto('/non-existent-page-12345');
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('text=페이지를 찾을 수 없습니다')).toBeVisible();

    // 홈으로 돌아가기 버튼
    await page.click('button:has-text("홈으로")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('권한 없는 페이지 접근', async ({ page }) => {
    // 일반 사용자로 로그인 후 관리자 전용 페이지 접근
    await page.goto('/logout');
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 관리자 전용 페이지 접근 시도
    await page.goto('/admin/settings');
    await expect(page.locator('text=접근 권한이 없습니다')).toBeVisible();
  });

  test('API 오류 시 사용자 피드백', async ({ page }) => {
    // API 요청 모킹하여 500 에러 발생
    await page.route('**/api/v1/employees*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await page.goto('/hr/employees');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('오류가 발생했습니다');

    // 재시도 버튼
    await page.unroute('**/api/v1/employees*');
    await page.click('button:has-text("다시 시도")');
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
  });

  test('네트워크 오류 처리', async ({ page }) => {
    await page.goto('/hr/employees');

    // 네트워크 오프라인 시뮬레이션
    await page.context().setOffline(true);

    await page.click('[data-testid="pagination-next"]');
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();

    // 네트워크 복구
    await page.context().setOffline(false);
    await page.click('button:has-text("다시 시도")');
    await expect(page.locator('[data-testid="network-error"]')).not.toBeVisible();
  });

  test('세션 만료 처리', async ({ page }) => {
    // 토큰 만료 시뮬레이션
    await page.route('**/api/v1/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Token expired' }),
      });
    });

    await page.goto('/hr/employees');
    await expect(page.locator('text=세션이 만료되었습니다')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
