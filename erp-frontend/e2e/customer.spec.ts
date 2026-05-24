import { test, expect } from '@playwright/test';

test.describe('客户管理模块测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button:has-text("登 录")');
    await page.waitForURL('**/home');
  });

  test('用户可以查看客户列表', async ({ page }) => {
    await page.click('text=客户管理');
    await page.click('text=客户列表');
    
    await page.waitForSelector('.el-table');
    const tableRows = await page.locator('.el-table__row').count();
    expect(tableRows).toBeGreaterThan(0);
  });

  test('用户可以搜索客户', async ({ page }) => {
    await page.click('text=客户管理');
    await page.click('text=客户列表');
    
    await page.fill('input[placeholder="请输入客户名称"]', '北京');
    await page.click('button:has-text("查询")');
    
    await page.waitForSelector('.el-table');
    const tableRows = await page.locator('.el-table__row').count();
    expect(tableRows).toBeGreaterThan(0);
  });

  test('用户可以新增客户', async ({ page }) => {
    await page.click('text=客户管理');
    await page.click('text=客户列表');
    
    await page.click('button:has-text("新增客户")');
    
    await page.fill('input[name="customerName"]', '测试客户');
    await page.fill('input[name="contact"]', '测试联系人');
    await page.fill('input[name="phone"]', '13800138000');
    await page.fill('input[name="address"]', '测试地址');
    
    await page.click('button:has-text("保存")');
    
    const successMessage = await page.locator('.el-message--success').textContent();
    expect(successMessage).toContain('保存成功');
  });

  test('用户可以编辑客户', async ({ page }) => {
    await page.click('text=客户管理');
    await page.click('text=客户列表');
    
    await page.waitForSelector('.el-table__row');
    await page.click('.el-table__row:first-child .el-button--text:has-text("编辑")');
    
    await page.fill('input[name="customerName"]', '编辑后的客户名称');
    await page.click('button:has-text("保存")');
    
    const successMessage = await page.locator('.el-message--success').textContent();
    expect(successMessage).toContain('保存成功');
  });

  test('用户可以删除客户', async ({ page }) => {
    await page.click('text=客户管理');
    await page.click('text=客户列表');
    
    await page.waitForSelector('.el-table__row');
    await page.click('.el-table__row:first-child .el-button--text:has-text("删除")');
    
    await page.click('button:has-text("确定")');
    
    const successMessage = await page.locator('.el-message--success').textContent();
    expect(successMessage).toContain('删除成功');
  });
});