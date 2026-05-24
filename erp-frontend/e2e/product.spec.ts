import { test, expect } from '@playwright/test';

test.describe('产品管理测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button:has-text("登 录")');
    await page.waitForURL('**/home');
  });

  test('产品列表 - 点击查看按钮应该跳转到详情页', async ({ page }) => {
    await page.click('text=产品管理');
    
    await page.waitForSelector('.el-table');
    
    const firstRow = page.locator('.el-table__row').first();
    await firstRow.locator('button:has-text("查看")').click();
    
    await page.waitForURL('**/product/**');
    
    const detailCard = page.locator('.el-card');
    await expect(detailCard).toBeVisible();
    
    const title = await page.locator('.el-card__header span').textContent();
    expect(title).toContain('产品详情');
    
    const descriptions = page.locator('.el-descriptions__label');
    expect(await descriptions.count()).toBeGreaterThan(0);
  });

  test('产品详情页 - 应该显示完整的产品信息', async ({ page }) => {
    await page.goto('http://localhost:3000/product/1');
    
    await page.waitForSelector('.el-descriptions');
    
    const productCode = await page.locator('.el-descriptions__content:has-text("CP202505200001")').isVisible();
    expect(productCode).toBeTruthy();
    
    const productName = await page.locator('.el-descriptions__content:has-text("A型配件")').isVisible();
    expect(productName).toBeTruthy();
    
    const price = await page.locator('.el-descriptions__content:has-text("¥100.00")').isVisible();
    expect(price).toBeTruthy();
    
    const cost = await page.locator('.el-descriptions__content:has-text("¥50.00")').isVisible();
    expect(cost).toBeTruthy();
  });

  test('产品详情页 - 返回按钮应该能正常工作', async ({ page }) => {
    await page.goto('http://localhost:3000/product/1');
    
    await page.waitForSelector('.el-button:has-text("返回")');
    
    await page.click('.el-button:has-text("返回")');
    
    await page.waitForURL('**/product');
  });

  test('产品列表 - 编辑功能应该能打开编辑对话框', async ({ page }) => {
    await page.click('text=产品管理');
    
    await page.waitForSelector('.el-table');
    
    const firstRow = page.locator('.el-table__row').first();
    await firstRow.locator('button:has-text("编辑")').click();
    
    const dialog = page.locator('.el-dialog');
    await expect(dialog).toBeVisible();
    
    const dialogTitle = await page.locator('.el-dialog__title').textContent();
    expect(dialogTitle).toContain('编辑产品');
    
    const form = page.locator('.el-dialog .el-form');
    await expect(form).toBeVisible();
  });

  test('产品列表 - 删除功能应该显示确认对话框', async ({ page }) => {
    await page.click('text=产品管理');
    
    await page.waitForSelector('.el-table');
    
    const firstRow = page.locator('.el-table__row').first();
    await firstRow.locator('button:has-text("删除")').click();
    
    const confirmBox = page.locator('.el-message-box');
    await expect(confirmBox).toBeVisible();
    
    const message = await page.locator('.el-message-box__message').textContent();
    expect(message).toContain('删除');
  });
});