import { test, expect } from '@playwright/test';
import { injectDemoData, login } from './utils/test-helpers';

test.describe('系统管理模块测试', () => {
  test.beforeEach(async ({ page }) => {
    await injectDemoData(page);
    await login(page);
  });

  test('用户管理页面访问测试', async ({ page }) => {
    await page.goto('/system/users');
    await expect(page).toHaveTitle(/用户/);
  });

  test('用户列表显示测试', async ({ page }) => {
    await page.goto('/system/users');
    await expect(page.locator('table')).toBeVisible();
  });

  test('消息管理页面访问测试', async ({ page }) => {
    await page.goto('/system/messages');
    await expect(page).toHaveTitle(/消息/);
  });

  test('消息列表显示测试', async ({ page }) => {
    await page.goto('/system/messages');
    await expect(page.locator('table')).toBeVisible();
  });

  test('操作日志页面访问测试', async ({ page }) => {
    await page.goto('/system/logs');
    await expect(page).toHaveTitle(/日志/);
  });

  test('操作日志列表显示测试', async ({ page }) => {
    await page.goto('/system/logs');
    await expect(page.locator('table')).toBeVisible();
  });

  test('数据管理页面访问测试', async ({ page }) => {
    await page.goto('/system/data');
    await expect(page).toHaveTitle(/数据/);
  });

  test('修改密码页面访问测试', async ({ page }) => {
    await page.goto('/system/password');
    await expect(page).toHaveTitle(/密码/);
  });
});
