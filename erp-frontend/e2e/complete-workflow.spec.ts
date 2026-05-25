import { test, expect } from '@playwright/test';
import { injectDemoData, login } from './utils/test-helpers';

test.describe('综合业务流程测试', () => {
  test.beforeEach(async ({ page }) => {
    await injectDemoData(page);
    await login(page);
  });

  test('从客户到收款的完整销售流程', async ({ page }) => {
    // 访问客户管理页面
    await page.goto('/sales/customers');
    await expect(page.locator('table')).toBeVisible();

    // 访问产品管理页面
    await page.goto('/sales/products');
    await expect(page.locator('table')).toBeVisible();

    // 访问报价单管理页面
    await page.goto('/sales/quotations');
    await expect(page.locator('table')).toBeVisible();

    // 访问销售订单管理页面
    await page.goto('/sales/orders');
    await expect(page.locator('table')).toBeVisible();

    // 访问应收款管理页面
    await page.goto('/finance/receivables');
    await expect(page.locator('table')).toBeVisible();
  });

  test('从供应商到付款的完整采购流程', async ({ page }) => {
    // 访问供应商管理页面
    await page.goto('/purchase/suppliers');
    await expect(page.locator('table')).toBeVisible();

    // 访问原材料管理页面
    await page.goto('/purchase/materials');
    await expect(page.locator('table')).toBeVisible();

    // 访问采购订单管理页面
    await page.goto('/purchase/orders');
    await expect(page.locator('table')).toBeVisible();

    // 访问应付款管理页面
    await page.goto('/finance/payables');
    await expect(page.locator('table')).toBeVisible();
  });

  test('从生产计划到入库的完整生产流程', async ({ page }) => {
    // 访问生产计划管理页面
    await page.goto('/production/plans');
    await expect(page.locator('table')).toBeVisible();

    // 访问配方管理页面
    await page.goto('/production/recipes');
    await expect(page.locator('table')).toBeVisible();

    // 访问库存管理页面
    await page.goto('/warehouse/inventory');
    await expect(page.locator('table')).toBeVisible();
  });

  test('从领料单到成品发货的完整仓库流程', async ({ page }) => {
    // 访问领料单管理页面
    await page.goto('/warehouse/picks');
    await expect(page.locator('table')).toBeVisible();

    // 访问库存管理页面
    await page.goto('/warehouse/inventory');
    await expect(page.locator('table')).toBeVisible();

    // 访问发货单管理页面
    await page.goto('/warehouse/deliveries');
    await expect(page.locator('table')).toBeVisible();
  });
});
