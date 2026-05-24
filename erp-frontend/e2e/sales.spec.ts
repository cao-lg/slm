import { test, expect } from '@playwright/test';

test.describe('销售流程测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button:has-text("登 录")');
    await page.waitForURL('**/home');
  });

  test('用户可以创建报价单', async ({ page }) => {
    await page.click('text=销售管理');
    await page.click('text=报价单管理');
    
    await page.click('button:has-text("新增报价单")');
    
    await page.fill('input[name="quotationNo"]', 'TEST20260524001');
    await page.click('.el-form-item__label:has-text("客户") + .el-form-item__content .el-input__inner');
    await page.click('.el-select-dropdown__item:first-child');
    
    await page.click('button:has-text("添加明细")');
    await page.click('.el-table__body-wrapper .el-form-item__label:has-text("产品") + .el-form-item__content .el-input__inner');
    await page.click('.el-select-dropdown__item:first-child');
    
    await page.fill('.el-table__body-wrapper input[name="quantity"]', '10');
    
    await page.click('button:has-text("保存")');
    
    const successMessage = await page.locator('.el-message--success').textContent();
    expect(successMessage).toContain('保存成功');
  });

  test('用户可以查看销售订单列表', async ({ page }) => {
    await page.click('text=销售管理');
    await page.click('text=销售订单');
    
    await page.waitForSelector('.el-table');
    const tableRows = await page.locator('.el-table__row').count();
    expect(tableRows).toBeGreaterThan(0);
  });

  test('报价单可以转为销售订单', async ({ page }) => {
    await page.click('text=销售管理');
    await page.click('text=报价单管理');
    
    await page.waitForSelector('.el-table__row');
    await page.click('.el-table__row:first-child .el-button--text:has-text("转订单")');
    
    await page.click('button:has-text("确认")');
    
    const successMessage = await page.locator('.el-message--success').textContent();
    expect(successMessage).toContain('转订单成功');
  });
});