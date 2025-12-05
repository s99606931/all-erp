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
