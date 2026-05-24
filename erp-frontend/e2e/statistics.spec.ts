import { test, expect } from '@playwright/test';

test.describe('统计页面测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button:has-text("登 录")');
    await page.waitForURL('**/home');
  });

  test('产品汇总 - 点击查看详情应该显示弹窗', async ({ page }) => {
    await page.click('text=销售管理');
    await page.click('text=产品汇总');
    
    await page.waitForSelector('.el-table');
    
    await page.click('.el-table__row:first-child button:has-text("查看详情")');
    
    const dialog = page.locator('.el-message-box__wrapper');
    await expect(dialog).toBeVisible();
    
    const dialogContent = await page.locator('.el-message-box__content').textContent();
    expect(dialogContent).toContain('产品详情');
    expect(dialogContent).toContain('产品编码');
    expect(dialogContent).toContain('产品名称');
    expect(dialogContent).toContain('总销售数量');
    expect(dialogContent).toContain('总销售金额');
    
    await page.click('.el-message-box__headerbtn');
  });

  test('订单统计 - 点击查看详情应该显示弹窗', async ({ page }) => {
    await page.click('text=销售管理');
    await page.click('text=订单统计');
    
    await page.waitForSelector('.el-table');
    
    await page.click('.el-table__row:first-child button:has-text("查看详情")');
    
    const dialog = page.locator('.el-message-box__wrapper');
    await expect(dialog).toBeVisible();
    
    const dialogContent = await page.locator('.el-message-box__content').textContent();
    expect(dialogContent).toContain('订单详情');
    expect(dialogContent).toContain('订单编号');
    expect(dialogContent).toContain('客户名称');
    expect(dialogContent).toContain('订单金额');
    
    await page.click('.el-message-box__headerbtn');
  });

  test('生产统计 - 点击查看详情应该显示弹窗', async ({ page }) => {
    await page.click('text=生产管理');
    await page.click('text=生产统计');
    
    await page.waitForSelector('.el-table');
    
    await page.click('.el-table__row:first-child button:has-text("查看详情")');
    
    const dialog = page.locator('.el-message-box__wrapper');
    await expect(dialog).toBeVisible();
    
    const dialogContent = await page.locator('.el-message-box__content').textContent();
    expect(dialogContent).toContain('生产计划详情');
    expect(dialogContent).toContain('计划编号');
    expect(dialogContent).toContain('产品名称');
    expect(dialogContent).toContain('计划数量');
    
    await page.click('.el-message-box__headerbtn');
  });
});