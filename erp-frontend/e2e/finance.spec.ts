import { test, expect } from '@playwright/test';
import { injectDemoData, login } from './utils/test-helpers';

test.describe('财务管理模块测试', () => {
  test.beforeEach(async ({ page }) => {
    await injectDemoData(page);
    await login(page);
  });

  test('应收款管理页面访问测试', async ({ page }) => {
    await page.goto('/finance/receivables');
    await expect(page).toHaveTitle(/应收款/);
  });

  test('应收款列表显示测试', async ({ page }) => {
    await page.goto('/finance/receivables');
    await expect(page.locator('table')).toBeVisible();
  });

  test('应付款管理页面访问测试', async ({ page }) => {
    await page.goto('/finance/payables');
    await expect(page).toHaveTitle(/应付款/);
  });

  test('应付款列表显示测试', async ({ page }) => {
    await page.goto('/finance/payables');
    await expect(page.locator('table')).toBeVisible();
  });

  test('费用管理页面访问测试', async ({ page }) => {
    await page.goto('/finance/expenses');
    await expect(page).toHaveTitle(/费用/);
  });

  test('费用列表显示测试', async ({ page }) => {
    await page.goto('/finance/expenses');
    await expect(page.locator('table')).toBeVisible();
  });
});
