import { test, expect } from '@playwright/test';
import { injectDemoData, login, clearTestData } from './utils/test-helpers';

test.describe('销售订单管理模块', () => {
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

  test('用户可以查看销售订单列表', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 验证页面加载
    await expect(page.locator('[data-testid="sales-order-list-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="sales-order-table"]')).toBeVisible();
    
    // 验证表格包含数据
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(4); // 演示数据中有4个销售订单
  });

  test('用户可以搜索销售订单', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 输入搜索关键词
    await page.fill('[data-testid="sales-order-no-search-input"] input', 'XS202505200001');
    await page.click('[data-testid="sales-order-search-btn"]');
    
    // 等待搜索结果
    await page.waitForTimeout(500);
    
    // 验证搜索结果
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(1);
    
    // 重置搜索
    await page.click('[data-testid="sales-order-reset-btn"]');
    await expect(tableRows).toHaveCount(4);
  });

  test('用户可以新增销售订单', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 点击新增销售订单按钮
    await page.click('[data-testid="add-sales-order-btn"]');
    
    // 验证对话框打开
    await expect(page.locator('[data-testid="sales-order-dialog"]')).toBeVisible();
    
    // 选择客户
    await page.click('[data-testid="sales-order-customer-select"]');
    await page.click('.el-select-dropdown__item:has-text("北京科技有限公司")');
    
    // 选择日期
    const today = new Date().toISOString().split('T')[0];
    await page.fill('[data-testid="sales-order-date-picker"] input', today);
    await page.fill('[data-testid="sales-order-delivery-picker"] input', today);
    
    // 添加产品明细
    await page.click('[data-testid="sales-order-add-detail-btn"]');
    await page.click('[data-testid="sales-order-product-select-0"]');
    await page.click('.el-select-dropdown__item:has-text("A型智能传感器")');
    
    // 填写数量和单价
    await page.fill('[data-testid="sales-order-quantity-input-0"] input', '10');
    await page.fill('[data-testid="sales-order-unit-price-input-0"] input', '280');
    
    // 提交表单
    await page.click('[data-testid="sales-order-dialog-submit-btn"]');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
    
    // 验证新销售订单出现在列表中
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(5);
  });

  test('用户可以编辑销售订单', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 点击待审核订单的编辑按钮
    await page.click('[data-testid="edit-sales-order-btn-4"]');
    
    // 验证对话框打开
    await expect(page.locator('[data-testid="sales-order-dialog"]')).toBeVisible();
    
    // 修改交货日期
    await page.fill('[data-testid="sales-order-delivery-picker"] input', '2025-06-01');
    
    // 提交表单
    await page.click('[data-testid="sales-order-dialog-submit-btn"]');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以审核销售订单', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 点击待审核订单的审核按钮
    await page.click('[data-testid="approve-sales-order-btn-4"]');
    
    // 确认操作
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以开始生产', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 点击已审核订单的开始生产按钮
    await page.click('[data-testid="produce-sales-order-btn-2"]');
    
    // 确认操作
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以发货', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 点击生产中订单的发货按钮
    await page.click('[data-testid="ship-sales-order-btn-2"]');
    
    // 确认操作
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以完成订单', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 点击已发货订单的完成按钮
    await page.click('[data-testid="complete-sales-order-btn-1"]');
    
    // 确认操作
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以查看销售订单详情', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 点击第一个销售订单的查看按钮
    await page.click('[data-testid="view-sales-order-btn-1"]');
    
    // 验证页面跳转到详情页
    await expect(page).toHaveURL(/\/sales\/order\/1/);
    
    // 验证详情页内容
    await expect(page.locator('[data-testid="sales-order-detail-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="sales-order-detail-descriptions"]')).toContainText('北京科技有限公司');
    
    // 返回列表
    await page.click('[data-testid="sales-order-detail-back-btn"]');
    await expect(page).toHaveURL(/\/sales\/order/);
  });

  test('用户可以删除销售订单', async ({ page }) => {
    // 导航到销售订单管理页面
    await page.goto('/sales/order');
    
    // 点击待审核订单的删除按钮
    await page.click('[data-testid="delete-sales-order-btn-4"]');
    
    // 确认删除
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
    
    // 验证销售订单已被删除
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(3);
  });
});
