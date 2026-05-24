import { test, expect } from '@playwright/test';

test.describe('财务核销测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button:has-text("登 录")');
    await page.waitForURL('**/home');
  });

  test('用户可以查看应收款列表', async ({ page }) => {
    await page.click('text=财务管理');
    await page.click('text=应收款管理');
    
    await page.waitForSelector('.el-table');
    const tableRows = await page.locator('.el-table__row').count();
    expect(tableRows).toBeGreaterThan(0);
  });

  test('用户可以核销应收款', async ({ page }) => {
    await page.click('text=财务管理');
    await page.click('text=应收款管理');
    
    await page.waitForSelector('.el-table__row');
    await page.click('.el-table__row:first-child .el-button--text:has-text("核销")');
    
    await page.fill('input[name="amount"]', '1000');
    await page.fill('input[name="paymentDate"]', '2026-05-24');
    await page.selectOption('select[name="paymentMethod"]', 'bank');
    
    await page.click('button:has-text("确认核销")');
    
    const successMessage = await page.locator('.el-message--success').textContent();
    expect(successMessage).toContain('核销成功');
  });

  test('用户可以查看应付款列表', async ({ page }) => {
    await page.click('text=财务管理');
    await page.click('text=应付款管理');
    
    await page.waitForSelector('.el-table');
    const tableRows = await page.locator('.el-table__row').count();
    expect(tableRows).toBeGreaterThan(0);
  });

  test('用户可以核销应付款', async ({ page }) => {
    await page.click('text=财务管理');
    await page.click('text=应付款管理');
    
    await page.waitForSelector('.el-table__row');
    await page.click('.el-table__row:first-child .el-button--text:has-text("核销")');
    
    await page.fill('input[name="amount"]', '1000');
    await page.fill('input[name="paymentDate"]', '2026-05-24');
    await page.selectOption('select[name="paymentMethod"]', 'cash');
    
    await page.click('button:has-text("确认核销")');
    
    const successMessage = await page.locator('.el-message--success').textContent();
    expect(successMessage).toContain('核销成功');
  });
});