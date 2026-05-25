import { test, expect } from '@playwright/test';
import { injectDemoData, login, clearTestData } from './utils/test-helpers';

test.describe('产品管理模块', () => {
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

  test('用户可以查看产品列表', async ({ page }) => {
    // 导航到产品管理页面
    await page.goto('/product');
    
    // 验证页面加载
    await expect(page.locator('[data-testid="product-list-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-table"]')).toBeVisible();
    
    // 验证表格包含数据
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(5); // 演示数据中有5个产品
  });

  test('用户可以搜索产品', async ({ page }) => {
    // 导航到产品管理页面
    await page.goto('/product');
    
    // 输入搜索关键词
    await page.fill('[data-testid="product-name-search-input"] input', 'A型');
    await page.click('[data-testid="product-search-btn"]');
    
    // 等待搜索结果
    await page.waitForTimeout(500);
    
    // 验证搜索结果
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(1);
    
    // 重置搜索
    await page.click('[data-testid="product-reset-btn"]');
    await expect(tableRows).toHaveCount(5);
  });

  test('用户可以新增产品', async ({ page }) => {
    // 导航到产品管理页面
    await page.goto('/product');
    
    // 点击新增产品按钮
    await page.click('[data-testid="add-product-btn"]');
    
    // 验证对话框打开
    await expect(page.locator('[data-testid="product-dialog"]')).toBeVisible();
    
    // 填写表单
    await page.fill('[data-testid="product-name-input"] input', '测试产品');
    await page.fill('[data-testid="product-category-input"] input', '测试分类');
    await page.fill('[data-testid="product-unit-input"] input', '个');
    await page.fill('[data-testid="product-spec-input"] input', '测试规格');
    await page.fill('[data-testid="product-price-input"] input', '100');
    await page.fill('[data-testid="product-cost-input"] input', '50');
    
    // 提交表单
    await page.click('[data-testid="product-dialog-submit-btn"]');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
    
    // 验证新产品出现在列表中
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(6);
  });

  test('用户可以编辑产品', async ({ page }) => {
    // 导航到产品管理页面
    await page.goto('/product');
    
    // 点击第一个产品的编辑按钮
    await page.click('[data-testid="edit-product-btn-1"]');
    
    // 验证对话框打开
    await expect(page.locator('[data-testid="product-dialog"]')).toBeVisible();
    
    // 修改产品名称
    await page.fill('[data-testid="product-name-input"] input', '修改后的产品名称');
    
    // 提交表单
    await page.click('[data-testid="product-dialog-submit-btn"]');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
  });

  test('用户可以查看产品详情', async ({ page }) => {
    // 导航到产品管理页面
    await page.goto('/product');
    
    // 点击第一个产品的查看按钮
    await page.click('[data-testid="view-product-btn-1"]');
    
    // 验证页面跳转到详情页
    await expect(page).toHaveURL(/\/product\/1/);
    
    // 验证详情页内容
    await expect(page.locator('[data-testid="product-detail-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-detail-descriptions"]')).toContainText('A型智能传感器');
    
    // 返回列表
    await page.click('[data-testid="product-detail-back-btn"]');
    await expect(page).toHaveURL(/\/product/);
  });

  test('用户可以删除产品', async ({ page }) => {
    // 导航到产品管理页面
    await page.goto('/product');
    
    // 点击最后一个产品的删除按钮
    await page.click('[data-testid="delete-product-btn-5"]');
    
    // 确认删除
    await page.click('button:has-text("确定")');
    
    // 验证成功提示
    const successMessage = page.locator('.el-message--success');
    await expect(successMessage).toBeVisible();
    
    // 验证产品已被删除
    const tableRows = page.locator('.el-table__row');
    await expect(tableRows).toHaveCount(4);
  });
});
