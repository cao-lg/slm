import { test, expect } from '@playwright/test';
import { injectDemoData, login, clearTestData } from './utils/test-helpers';

test.describe('客户管理模块', () => {
  test.beforeEach(async ({ page }) => {
    // 注入演示数据
    await injectDemoData(page);
    // 登录系统
    await login(page, 'admin', 'admin123');
  });

  test.afterEach(async ({ page }) => {
    // 清理测试数据
    await clearTestData(page);
  });

  test('用户可以查看客户列表', async ({ page }) => {
    // 导航到客户管理页面
    await page.goto('/sales/customer');
    
    // 验证页面加载
    await expect(page.locator('[data-testid="customer-list-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="customer-table"]')).toBeVisible();
    
    // 验证表格包含数据
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(4); // 演示数据中有4个客户
  });

  test('用户可以搜索客户', async ({ page }) => {
    // 导航到客户管理页面
    await page.goto('/sales/customer');
    
    // 输入搜索关键词
    await page.fill('[data-testid="customer-name-search-input"] input', '北京');
    await page.click('[data-testid="customer-search-btn"]');
    
    // 等待搜索结果
    await page.waitForTimeout(500);
    
    // 验证搜索结果
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(1);
    
    // 重置搜索
    await page.click('[data-testid="customer-reset-btn"]');
    await expect(tableRows).toHaveCount(4);
  });

  test('用户可以新增客户', async ({ page }) => {
    // 导航到客户管理页面
    await page.goto('/sales/customer');
    
    // 点击新增客户按钮
    await page.click('[data-testid="add-customer-btn"]');
    
    // 验证对话框打开
    await expect(page.locator('[data-testid="customer-dialog"]')).toBeVisible();
    
    // 填写表单
    await page.fill('[data-testid="customer-name-input"] input', '测试客户');
    await page.fill('[data-testid="customer-contact-input"] input', '张三');
    await page.fill('[data-testid="customer-phone-input"] input', '13800138000');
    await page.fill('[data-testid="customer-email-input"] input', 'test@example.com');
    await page.fill('[data-testid="customer-address-input"] textarea', '测试地址');
    
    // 提交表单
    await page.click('[data-testid="customer-dialog-submit-btn"]');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
    
    // 验证新客户出现在列表中
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(5);
  });

  test('用户可以编辑客户', async ({ page }) => {
    // 导航到客户管理页面
    await page.goto('/sales/customer');
    
    // 点击第一个客户的编辑按钮
    await page.click('[data-testid="edit-customer-btn-1"]');
    
    // 验证对话框打开
    await expect(page.locator('[data-testid="customer-dialog"]')).toBeVisible();
    
    // 修改客户名称
    await page.fill('[data-testid="customer-name-input"] input', '修改后的客户名称');
    
    // 提交表单
    await page.click('[data-testid="customer-dialog-submit-btn"]');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以查看客户详情', async ({ page }) => {
    // 导航到客户管理页面
    await page.goto('/sales/customer');
    
    // 点击第一个客户的查看按钮
    await page.click('[data-testid="view-customer-btn-1"]');
    
    // 验证页面跳转到详情页
    await expect(page).toHaveURL(/\/sales\/customer\/1/);
    
    // 验证详情页内容
    await expect(page.locator('[data-testid="customer-detail-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="customer-detail-descriptions"]')).toContainText('北京科技有限公司');
    
    // 返回列表
    await page.click('[data-testid="customer-detail-back-btn"]');
    await expect(page).toHaveURL(/\/sales\/customer/);
  });

  test('用户可以删除客户', async ({ page }) => {
    // 导航到客户管理页面
    await page.goto('/sales/customer');
    
    // 点击第一个客户的删除按钮
    await page.click('[data-testid="delete-customer-btn-4"]'); // 删除最后一个客户
    
    // 确认删除
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
    
    // 验证客户已被删除
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(3);
  });
});
