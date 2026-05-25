import { test, expect } from '@playwright/test';
import { injectDemoData, login, clearTestData } from './utils/test-helpers';

test.describe('报价单管理模块', () => {
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

  test('用户可以查看报价单列表', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 验证页面加载
    await expect(page.locator('[data-testid="quotation-list-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="quotation-table"]')).toBeVisible();
    
    // 验证表格包含数据
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(4); // 演示数据中有4个报价单
  });

  test('用户可以搜索报价单', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 输入搜索关键词
    await page.fill('[data-testid="quotation-no-search-input"] input', 'BJ202505200001');
    await page.click('[data-testid="quotation-search-btn"]');
    
    // 等待搜索结果
    await page.waitForTimeout(500);
    
    // 验证搜索结果
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(1);
    
    // 重置搜索
    await page.click('[data-testid="quotation-reset-btn"]');
    await expect(tableRows).toHaveCount(4);
  });

  test('用户可以新增报价单', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 点击新增报价单按钮
    await page.click('[data-testid="add-quotation-btn"]');
    
    // 验证对话框打开
    await expect(page.locator('[data-testid="quotation-dialog"]')).toBeVisible();
    
    // 选择客户
    await page.click('[data-testid="quotation-customer-select"]');
    await page.click('.el-select-dropdown__item:has-text("北京科技有限公司")');
    
    // 选择日期
    const today = new Date().toISOString().split('T')[0];
    await page.fill('[data-testid="quotation-date-picker"] input', today);
    await page.fill('[data-testid="quotation-valid-until-picker"] input', today);
    
    // 添加产品明细
    await page.click('[data-testid="quotation-add-detail-btn"]');
    await page.click('[data-testid="quotation-product-select-0"]');
    await page.click('.el-select-dropdown__item:has-text("A型智能传感器")');
    
    // 填写数量和单价
    await page.fill('[data-testid="quotation-quantity-input-0"] input', '10');
    await page.fill('[data-testid="quotation-unit-price-input-0"] input', '280');
    
    // 提交表单
    await page.click('[data-testid="quotation-dialog-submit-btn"]');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
    
    // 验证新报价单出现在列表中
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(5);
  });

  test('用户可以编辑报价单', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 点击待确认报价单的编辑按钮
    await page.click('[data-testid="edit-quotation-btn-2"]');
    
    // 验证对话框打开
    await expect(page.locator('[data-testid="quotation-dialog"]')).toBeVisible();
    
    // 修改备注（这里我们模拟修改其他字段）
    await page.fill('[data-testid="quotation-date-picker"] input', '2025-06-01');
    
    // 提交表单
    await page.click('[data-testid="quotation-dialog-submit-btn"]');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以接受报价单', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 点击待确认报价单的接受按钮
    await page.click('[data-testid="approve-quotation-btn-2"]');
    
    // 确认操作
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以拒绝报价单', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 点击待确认报价单的拒绝按钮
    await page.click('[data-testid="reject-quotation-btn-2"]');
    
    // 确认操作
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以将报价单转为订单', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 点击已接受报价单的转为订单按钮
    await page.click('[data-testid="convert-quotation-btn-1"]');
    
    // 确认操作
    await page.click('button:has-text("确定")');
    
    // 验证跳转到销售订单页面
    await expect(page).toHaveURL(/\/sales\/order/);
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以查看报价单详情', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 点击第一个报价单的查看按钮
    await page.click('[data-testid="view-quotation-btn-1"]');
    
    // 验证页面跳转到详情页
    await expect(page).toHaveURL(/\/sales\/quotation\/1/);
    
    // 验证详情页内容
    await expect(page.locator('[data-testid="quotation-detail-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="quotation-detail-descriptions"]')).toContainText('北京科技有限公司');
    
    // 返回列表
    await page.click('[data-testid="quotation-detail-back-btn"]');
    await expect(page).toHaveURL(/\/sales\/quotation/);
  });

  test('用户可以删除报价单', async ({ page }) => {
    // 导航到报价单管理页面
    await page.goto('/sales/quotation');
    
    // 点击待确认报价单的删除按钮
    await page.click('[data-testid="delete-quotation-btn-2"]');
    
    // 确认删除
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
    
    // 验证报价单已被删除
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(3);
  });
});
