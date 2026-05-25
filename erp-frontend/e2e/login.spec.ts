import { test, expect } from '@playwright/test';
import { login, injectDemoData, clearTestData } from './utils/test-helpers';

test.describe('ERP系统登录测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearTestData(page);
    await injectDemoData(page);
  });

  test.afterEach(async ({ page }) => {
    await clearTestData(page);
  });

  test('用户可以使用正确的凭证登录', async ({ page }) => {
    await login(page, 'admin', 'admin123');
    await expect(page).toHaveURL(/.*home/);
    const welcomeText = await page.locator('h1').textContent();
    expect(welcomeText).toContain('欢迎');
  });

  test('用户使用错误密码登录失败', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username-input"] input', 'admin');
    await page.fill('[data-testid="password-input"] input', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await page.waitForSelector('.el-message--error', { timeout: 5000 });
    const errorMessage = await page.locator('.el-message--error').textContent();
    expect(errorMessage).toContain('登录失败');
  });

  test('用户名不能为空', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="password-input"] input', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    await page.waitForSelector('.el-form-item__error', { timeout: 5000 });
    const validationMessage = await page.locator('.el-form-item__error').textContent();
    expect(validationMessage).toContain('请输入用户名');
  });

  test('密码不能为空', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username-input"] input', 'admin');
    await page.click('[data-testid="login-button"]');
    
    await page.waitForSelector('.el-form-item__error', { timeout: 5000 });
    const validationMessage = await page.locator('.el-form-item__error').allTextContents();
    expect(validationMessage.some(text => text.includes('请输入密码'))).toBeTruthy();
  });
});
