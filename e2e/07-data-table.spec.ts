import { test, expect } from '@playwright/test';

/**
 * 데이터 테이블 E2E 테스트
 * 
 * 목록 페이지의 페이징, 정렬, 필터링 기능을 검증합니다.
 */
test.describe('데이터 테이블', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('직원 목록 페이징', async ({ page }) => {
    await page.goto('/hr/employees');

    // 페이지 정보 확인
    await expect(page.locator('[data-testid="pagination-info"]')).toContainText('총');

    // 다음 페이지로 이동
    await page.click('[data-testid="pagination-next"]');
    await expect(page.locator('[data-testid="pagination-current"]')).toHaveText('2');

    // 이전 페이지로 이동
    await page.click('[data-testid="pagination-prev"]');
    await expect(page.locator('[data-testid="pagination-current"]')).toHaveText('1');
  });

  test('직원 목록 정렬', async ({ page }) => {
    await page.goto('/hr/employees');

    // 이름 컬럼 클릭하여 정렬
    await page.click('[data-testid="sort-name"]');
    await expect(page.locator('[data-testid="sort-name"]')).toHaveAttribute('data-sort-direction', 'asc');

    // 다시 클릭하여 역순 정렬
    await page.click('[data-testid="sort-name"]');
    await expect(page.locator('[data-testid="sort-name"]')).toHaveAttribute('data-sort-direction', 'desc');
  });

  test('직원 목록 검색/필터', async ({ page }) => {
    await page.goto('/hr/employees');

    // 검색어 입력
    await page.fill('[data-testid="search-input"]', '홍길동');
    await page.click('[data-testid="search-submit"]');

    // 검색 결과 확인
    await expect(page.locator('table tbody tr')).toHaveCount(1);
    await expect(page.locator('table tbody tr').first()).toContainText('홍길동');

    // 검색어 초기화
    await page.click('[data-testid="search-clear"]');
    await expect(page.locator('table tbody tr')).not.toHaveCount(1);
  });

  test('부서별 필터', async ({ page }) => {
    await page.goto('/hr/employees');

    // 부서 필터 선택
    await page.selectOption('[data-testid="filter-department"]', '개발부');
    
    // 필터링된 결과 확인
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).locator('[data-testid="employee-department"]')).toContainText('개발부');
    }
  });

  test('페이지 크기 변경', async ({ page }) => {
    await page.goto('/hr/employees');

    // 페이지 크기 변경
    await page.selectOption('[data-testid="page-size"]', '50');
    
    // URL 파라미터 확인
    await expect(page).toHaveURL(/pageSize=50/);
  });
});
