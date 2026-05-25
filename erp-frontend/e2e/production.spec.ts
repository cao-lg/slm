import { test, expect } from '@playwright/test';
import { injectDemoData, login } from './utils/test-helpers';

test.describe('生产管理模块测试', () => {
  test.beforeEach(async ({ page }) => {
    await injectDemoData(page);
    await login(page);
  });

  test('生产计划管理页面访问测试', async ({ page }) => {
    await page.goto('/production/plans');
    await expect(page).toHaveTitle(/生产计划/);
  });

  test('生产计划列表显示测试', async ({ page }) => {
    await page.goto('/production/plans');
    await expect(page.locator('table')).toBeVisible();
  });

  test('新增生产计划对话框打开测试', async ({ page }) => {
    await page.goto('/production/plans');
    await page.getByRole('button', { name: '新增计划' }).click();
    await expect(page.getByRole('dialog', { name: /新增/ })).toBeVisible();
  });

  test('生产统计页面访问测试', async ({ page }) => {
    await page.goto('/production/statistics');
    await expect(page).toHaveTitle(/生产统计/);
  });

  test('配方管理页面访问测试', async ({ page }) => {
    await page.goto('/production/recipes');
    await expect(page).toHaveTitle(/配方/);
  });

  test('配方列表显示测试', async ({ page }) => {
    await page.goto('/production/recipes');
    await expect(page.locator('table')).toBeVisible();
  });

  test('新增配方对话框打开测试', async ({ page }) => {
    await page.goto('/production/recipes');
    await page.getByRole('button', { name: '新增配方' }).click();
    await expect(page.getByRole('dialog', { name: /新增/ })).toBeVisible();
  });
});
