import { test, expect } from '@playwright/test';

test.describe('ERP系统登录测试', () => {
  test('用户可以使用正确的凭证登录', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    
    await page.click('button:has-text("登 录")');
    
    await page.waitForURL('**/home');
    await expect(page).toHaveURL(/.*home/);
    
    const welcomeText = await page.locator('h1').textContent();
    expect(welcomeText).toContain('欢迎');
  });

  test('用户使用错误密码登录失败', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    await page.click('button:has-text("登 录")');
    
    const errorMessage = await page.locator('.el-message--error').textContent();
    expect(errorMessage).toContain('登录失败');
  });

  test('用户名不能为空', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button:has-text("登 录")');
    
    const validationMessage = await page.locator('label:has-text("用户名") + span.el-form-item__error').textContent();
    expect(validationMessage).toContain('请输入用户名');
  });

  test('密码不能为空', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="username"]', 'admin');
    await page.click('button:has-text("登 录")');
    
    const validationMessage = await page.locator('label:has-text("密码") + span.el-form-item__error').textContent();
    expect(validationMessage).toContain('请输入密码');
  });
});