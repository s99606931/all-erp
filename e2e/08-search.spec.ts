import { test, expect } from '@playwright/test';

/**
 * 검색 기능 E2E 테스트
 * 
 * 전역 검색 및 각 모듈별 검색 기능을 검증합니다.
 */
test.describe('검색 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('전역 검색', async ({ page }) => {
    await page.goto('/dashboard');

    // 전역 검색 활성화 (Cmd/Ctrl + K)
    await page.keyboard.press('Control+k');
    await expect(page.locator('[data-testid="global-search-modal"]')).toBeVisible();

    // 검색어 입력
    await page.fill('[data-testid="global-search-input"]', '홍길동');
    
    // 검색 결과 표시 확인
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-result-item"]').first()).toBeVisible();

    // 검색 결과 클릭하여 이동
    await page.click('[data-testid="search-result-item"]');
    await expect(page).toHaveURL(/\/hr\/employees\//);
  });

  test('검색 결과 없음 처리', async ({ page }) => {
    await page.goto('/hr/employees');

    await page.fill('[data-testid="search-input"]', '존재하지않는검색어12345');
    await page.click('[data-testid="search-submit"]');

    await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="no-results"]')).toContainText('검색 결과가 없습니다');
  });

  test('검색어 하이라이트', async ({ page }) => {
    await page.goto('/hr/employees');

    await page.fill('[data-testid="search-input"]', '홍');
    await page.click('[data-testid="search-submit"]');

    // 검색어가 하이라이트 되는지 확인
    await expect(page.locator('mark')).toContainText('홍');
  });

  test('최근 검색어 저장', async ({ page }) => {
    await page.goto('/hr/employees');

    // 검색 수행
    await page.fill('[data-testid="search-input"]', '테스트 검색');
    await page.click('[data-testid="search-submit"]');

    // 페이지 새로고침
    await page.reload();

    // 검색창 포커스 시 최근 검색어 표시
    await page.click('[data-testid="search-input"]');
    await expect(page.locator('[data-testid="recent-searches"]')).toContainText('테스트 검색');
  });
});
