import { test, expect } from '@playwright/test';

/**
 * 반응형 디자인 E2E 테스트
 * 
 * 다양한 화면 크기에서 UI가 올바르게 렌더링되는지 검증합니다.
 */
test.describe('반응형 디자인', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('데스크톱 레이아웃 (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');

    // 사이드바가 보여야 함
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    
    // 사이드바가 확장 상태
    await expect(page.locator('[data-testid="sidebar"]')).not.toHaveClass(/collapsed/);
  });

  test('태블릿 레이아웃 (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');

    // 사이드바가 축소 상태
    await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/collapsed/);
    
    // 햄버거 메뉴 버튼 표시
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
  });

  test('모바일 레이아웃 (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // 사이드바가 숨겨져야 함
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible();
    
    // 햄버거 메뉴 클릭 시 사이드바 표시
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-sidebar"]')).toBeVisible();
  });

  test('테이블 스크롤 (모바일)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/hr/employees');

    // 가로 스크롤 가능
    const tableContainer = page.locator('[data-testid="table-container"]');
    await expect(tableContainer).toHaveCSS('overflow-x', 'auto');
  });

  test('폼 레이아웃 변화', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/hr/employees/new');

    // 데스크톱: 2컬럼 그리드
    const formGrid = page.locator('[data-testid="form-grid"]');
    await expect(formGrid).toHaveCSS('grid-template-columns', /1fr 1fr/);

    // 모바일: 1컬럼 그리드
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(formGrid).toHaveCSS('grid-template-columns', /1fr/);
  });
});
