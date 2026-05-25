import { test, expect } from '@playwright/test';
import { injectDemoData, login } from './utils/test-helpers';

test.describe('采购管理模块测试', () => {
  test.beforeEach(async ({ page }) => {
    await injectDemoData(page);
    await login(page);
  });

  test('供应商管理页面访问测试', async ({ page }) => {
    // 访问供应商管理页面
    await page.goto('/purchase/suppliers');
    await expect(page).toHaveTitle(/供应商管理/);
  });

  test('供应商列表显示测试', async ({ page }) => {
    await page.goto('/purchase/suppliers');
    // 检查是否有表格数据
    await expect(page.locator('table')).toBeVisible();
  });

  test('新增供应商对话框打开测试', async ({ page }) => {
    await page.goto('/purchase/suppliers');
    // 点击新增按钮
    await page.getByRole('button', { name: '新增供应商' }).click();
    // 检查对话框是否打开
    await expect(page.getByRole('dialog', { name: /新增/ })).toBeVisible();
  });

  test('采购订单管理页面访问测试', async ({ page }) => {
    await page.goto('/purchase/orders');
    await expect(page).toHaveTitle(/采购订单/);
  });

  test('采购订单列表显示测试', async ({ page }) => {
    await page.goto('/purchase/orders');
    await expect(page.locator('table')).toBeVisible();
  });

  test('原材料管理页面访问测试', async ({ page }) => {
    await page.goto('/purchase/materials');
    await expect(page).toHaveTitle(/原材料/);
  });

  test('原材料列表显示测试', async ({ page }) => {
    await page.goto('/purchase/materials');
    await expect(page.locator('table')).toBeVisible();
  });
});
