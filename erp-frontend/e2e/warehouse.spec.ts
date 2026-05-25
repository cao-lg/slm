import { test, expect } from '@playwright/test';
import { injectDemoData, login } from './utils/test-helpers';

test.describe('仓库管理模块测试', () => {
  test.beforeEach(async ({ page }) => {
    await injectDemoData(page);
    await login(page);
  });

  test('库存管理页面访问测试', async ({ page }) => {
    await page.goto('/warehouse/inventory');
    await expect(page).toHaveTitle(/库存/);
  });

  test('库存列表显示测试', async ({ page }) => {
    await page.goto('/warehouse/inventory');
    await expect(page.locator('table')).toBeVisible();
  });

  test('发货单管理页面访问测试', async ({ page }) => {
    await page.goto('/warehouse/deliveries');
    await expect(page).toHaveTitle(/发货/);
  });

  test('发货单列表显示测试', async ({ page }) => {
    await page.goto('/warehouse/deliveries');
    await expect(page.locator('table')).toBeVisible();
  });

  test('领料单管理页面访问测试', async ({ page }) => {
    await page.goto('/warehouse/picks');
    await expect(page).toHaveTitle(/领料/);
  });

  test('领料单列表显示测试', async ({ page }) => {
    await page.goto('/warehouse/picks');
    await expect(page.locator('table')).toBeVisible();
  });

  test('调拨单管理页面访问测试', async ({ page }) => {
    await page.goto('/warehouse/transfers');
    await expect(page).toHaveTitle(/调拨/);
  });

  test('调拨单列表显示测试', async ({ page }) => {
    await page.goto('/warehouse/transfers');
    await expect(page.locator('table')).toBeVisible();
  });

  test('退货单管理页面访问测试', async ({ page }) => {
    await page.goto('/warehouse/returns');
    await expect(page).toHaveTitle(/退货/);
  });

  test('退货单列表显示测试', async ({ page }) => {
    await page.goto('/warehouse/returns');
    await expect(page.locator('table')).toBeVisible();
  });
});
