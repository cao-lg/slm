import { test, expect } from '@playwright/test';
import { injectDemoData, login, clearTestData } from './utils/test-helpers';

test.describe('完整销售流程', () => {
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

  test('从创建客户到完成订单的完整销售流程', async ({ page }) => {
    // 步骤1: 创建新客户
    await page.goto('/sales/customer');
    await page.click('[data-testid="add-customer-btn"]');
    await page.fill('[data-testid="customer-name-input"] input', '测试客户公司');
    await page.fill('[data-testid="customer-contact-input"] input', '李四');
    await page.fill('[data-testid="customer-phone-input"] input', '13900139000');
    await page.fill('[data-testid="customer-email-input"] input', 'lisi@example.com');
    await page.fill('[data-testid="customer-address-input"] textarea', '上海市浦东新区');
    await page.click('[data-testid="customer-dialog-submit-btn"]');
    
    // 验证客户创建成功
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 步骤2: 确保产品存在
    await page.goto('/product');
    await expect(page.locator('.el-table__row')).toHaveCount(5);
    
    // 步骤3: 创建报价单
    await page.goto('/sales/quotation');
    await page.click('[data-testid="add-quotation-btn"]');
    
    // 选择客户
    await page.click('[data-testid="quotation-customer-select"]');
    await page.click('.el-select-dropdown__item:has-text("测试客户公司")');
    
    // 选择日期
    const today = new Date().toISOString().split('T')[0];
    await page.fill('[data-testid="quotation-date-picker"] input', today);
    await page.fill('[data-testid="quotation-valid-until-picker"] input', today);
    
    // 添加产品明细
    await page.click('[data-testid="quotation-add-detail-btn"]');
    await page.click('[data-testid="quotation-product-select-0"]');
    await page.click('.el-select-dropdown__item:has-text("A型智能传感器")');
    await page.fill('[data-testid="quotation-quantity-input-0"] input', '100');
    await page.fill('[data-testid="quotation-unit-price-input-0"] input', '280');
    
    // 提交报价单
    await page.click('[data-testid="quotation-dialog-submit-btn"]');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 步骤4: 接受报价单
    await page.waitForTimeout(500);
    const tableRows = page.locator('.el-table__row');
    const lastRow = tableRows.last();
    await lastRow.locator('button:has-text("接受")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 步骤5: 将报价单转为订单
    await page.waitForTimeout(500);
    await lastRow.locator('button:has-text("转为订单")').click();
    await page.click('button:has-text("确定")');
    
    // 验证跳转到订单页面
    await expect(page).toHaveURL(/\/sales\/order/);
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 步骤6: 审核订单
    await page.waitForTimeout(500);
    const orderRows = page.locator('.el-table__row');
    const lastOrderRow = orderRows.last();
    await lastOrderRow.locator('button:has-text("审核")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 步骤7: 开始生产
    await page.waitForTimeout(500);
    await lastOrderRow.locator('button:has-text("开始生产")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 步骤8: 发货
    await page.waitForTimeout(500);
    await lastOrderRow.locator('button:has-text("发货")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 步骤9: 完成订单
    await page.waitForTimeout(500);
    await lastOrderRow.locator('button:has-text("完成")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 步骤10: 验证应收款已生成
    await page.goto('/finance/receivable');
    const receivableRows = page.locator('.el-table__row');
    await expect(receivableRows).toHaveCount(4); // 原有的3个加上新生成的1个
  });

  test('从订单到应收款的快速流程', async ({ page }) => {
    // 直接创建销售订单
    await page.goto('/sales/order');
    await page.click('[data-testid="add-sales-order-btn"]');
    
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
    await page.fill('[data-testid="sales-order-quantity-input-0"] input', '50');
    await page.fill('[data-testid="sales-order-unit-price-input-0"] input', '280');
    
    // 提交订单
    await page.click('[data-testid="sales-order-dialog-submit-btn"]');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 快速完成订单流程
    await page.waitForTimeout(500);
    const orderRows = page.locator('.el-table__row');
    const lastOrderRow = orderRows.last();
    
    // 审核
    await lastOrderRow.locator('button:has-text("审核")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 开始生产
    await page.waitForTimeout(500);
    await lastOrderRow.locator('button:has-text("开始生产")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 发货
    await page.waitForTimeout(500);
    await lastOrderRow.locator('button:has-text("发货")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 完成
    await page.waitForTimeout(500);
    await lastOrderRow.locator('button:has-text("完成")').click();
    await page.click('button:has-text("确定")');
    await expect(page.locator('.el-message--success')).toBeVisible();
    
    // 验证应收款
    await page.goto('/finance/receivable');
    await expect(page.locator('.el-table__row')).toHaveCount(4);
  });
});
