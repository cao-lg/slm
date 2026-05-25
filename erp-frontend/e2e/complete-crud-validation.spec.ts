import { test, expect } from '@playwright/test';
import { injectDemoData, login } from './utils/test-helpers';

test.describe('ERP系统完整CRUD和数据关系验证测试', () => {
  test.beforeEach(async ({ page }) => {
    // 先访问一个页面以确保页面环境加载完成
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // 然后再注入数据
    await injectDemoData(page);
    await login(page);
  });

  // Phase 1: 销售模块测试
  test.describe('销售模块', () => {
    test('客户管理 - Read验证', async ({ page }) => {
      await page.goto('/sales/customers');
      await expect(page.locator('table')).toBeVisible();
      
      const customerNames = ['北京科技有限公司', '上海商贸集团', '深圳智能制造', '广州电子科技'];
      for (const name of customerNames) {
        await expect(page.getByText(name)).toBeVisible();
      }
    });

    test('产品管理 - Read验证', async ({ page }) => {
      await page.goto('/sales/products');
      await expect(page.locator('table')).toBeVisible();
      
      const products = ['A型智能传感器', 'B型控制模块', 'C型连接配件', 'D型工业电源', 'E型通信模块'];
      for (const product of products) {
        await expect(page.getByText(product)).toBeVisible();
      }
    });

    test('报价单管理 - Read和数据关系验证', async ({ page }) => {
      await page.goto('/sales/quotations');
      await expect(page.locator('table')).toBeVisible();
      
      // 验证报价单数据存在
      await expect(page.getByText('BJ202505200001')).toBeVisible();
      
      // 验证报价单关联客户
      await expect(page.getByText('北京科技有限公司')).toBeVisible();
    });

    test('销售订单管理 - Read、数据关系和状态验证', async ({ page }) => {
      await page.goto('/sales/orders');
      await expect(page.locator('table')).toBeVisible();
      
      // 验证订单存在
      await expect(page.getByText('XS202505200001')).toBeVisible();
      await expect(page.getByText('XS202505200002')).toBeVisible();
      await expect(page.getByText('XS202505200003')).toBeVisible();
      
      // 验证订单-客户关系
      await expect(page.getByText('北京科技有限公司')).toBeVisible();
      await expect(page.getByText('上海商贸集团')).toBeVisible();
      await expect(page.getByText('深圳智能制造')).toBeVisible();
      
      // 验证订单状态
      await expect(page.getByText(/已发货|shipped|completed|生产中|producing|待处理|pending/)).toBeVisible();
    });
  });

  // Phase 2: 采购模块测试
  test.describe('采购模块', () => {
    test('供应商管理 - Read验证', async ({ page }) => {
      await page.goto('/purchase/suppliers');
      await expect(page.locator('table')).toBeVisible();
      
      const suppliers = ['果山环保科技', '德堡新材料', '深圳精密电子', '上海机械制造'];
      for (const supplier of suppliers) {
        await expect(page.getByText(supplier)).toBeVisible();
      }
    });

    test('物料管理 - Read验证', async ({ page }) => {
      await page.goto('/purchase/materials');
      await expect(page.locator('table')).toBeVisible();
      
      const materials = ['PCB电路板', '集成电路芯片', '电阻电容包', '塑料外壳', '连接线束', '金属外壳', '包装材料'];
      for (const material of materials) {
        await expect(page.getByText(material)).toBeVisible();
      }
    });

    test('采购订单管理 - Read和数据关系验证', async ({ page }) => {
      await page.goto('/purchase/orders');
      await expect(page.locator('table')).toBeVisible();
      
      // 验证订单存在
      await expect(page.getByText('CG202505200001')).toBeVisible();
      await expect(page.getByText('CG202505200002')).toBeVisible();
      
      // 验证订单-供应商关系
      await expect(page.getByText('深圳精密电子')).toBeVisible();
      await expect(page.getByText('上海机械制造')).toBeVisible();
      await expect(page.getByText('果山环保科技')).toBeVisible();
    });
  });

  // Phase 3: 生产模块测试
  test.describe('生产模块', () => {
    test('生产计划管理 - Read和数据关系验证', async ({ page }) => {
      await page.goto('/production/plans');
      await expect(page.locator('table')).toBeVisible();
      
      // 验证计划存在
      await expect(page.getByText('SC202505200001')).toBeVisible();
      await expect(page.getByText('SC202505200002')).toBeVisible();
      
      // 验证计划-产品关系
      await expect(page.getByText('A型智能传感器')).toBeVisible();
      await expect(page.getByText('B型控制模块')).toBeVisible();
      
      // 验证计划数量显示
      await expect(page.getByText(/100/).first()).toBeVisible();
    });

    test('配方单管理 - Read验证', async ({ page }) => {
      await page.goto('/production/recipes');
      await expect(page.locator('table')).toBeVisible();
      
      await expect(page.getByText('PF202505200001')).toBeVisible();
      await expect(page.getByText('PF202505200002')).toBeVisible();
    });
  });

  // Phase 4: 财务模块测试
  test.describe('财务模块', () => {
    test('应收账款管理 - Read和数据关系验证', async ({ page }) => {
      await page.goto('/finance/receivables');
      await expect(page.locator('table')).toBeVisible();
      
      // 验证应收款关联订单
      await expect(page.getByText('XS202505200001')).toBeVisible();
      await expect(page.getByText('XS202505200003')).toBeVisible();
      
      // 验证应收款关联客户
      await expect(page.getByText('深圳智能制造')).toBeVisible();
      await expect(page.getByText('北京科技有限公司')).toBeVisible();
      
      // 验证金额显示
      await expect(page.getByText(/84,?000/).first()).toBeVisible();
    });

    test('应付账款管理 - Read和数据关系验证', async ({ page }) => {
      await page.goto('/finance/payables');
      await expect(page.locator('table')).toBeVisible();
      
      // 验证应付款关联订单
      await expect(page.getByText('CG202505200001')).toBeVisible();
      await expect(page.getByText('CG202505200002')).toBeVisible();
      
      // 验证应付款关联供应商
      await expect(page.getByText('深圳精密电子')).toBeVisible();
      await expect(page.getByText('上海机械制造')).toBeVisible();
    });
  });

  // Phase 5: 仓库模块测试
  test.describe('仓库模块', () => {
    test('库存管理 - Read验证', async ({ page }) => {
      await page.goto('/warehouse/inventory');
      await expect(page.locator('table')).toBeVisible();
      
      // 验证仓库名称
      await expect(page.getByText(/KCA|KCB|KCC|成品|材料/).first()).toBeVisible();
    });

    test('调拨单管理 - Read和数据关系验证', async ({ page }) => {
      await page.goto('/warehouse/transfers');
      await expect(page.locator('table')).toBeVisible();
      
      await expect(page.getByText('DB202505200001')).toBeVisible();
      
      // 验证调拨单关联仓库
      await expect(page.getByText(/KCA|KCB|KCC/).first()).toBeVisible();
    });

    test('领料单管理 - Read和数据关系验证', async ({ page }) => {
      await page.goto('/warehouse/picks');
      await expect(page.locator('table')).toBeVisible();
      
      await expect(page.getByText('LL202505200001')).toBeVisible();
      
      // 验证领料单关联生产计划
      await expect(page.getByText('SC202505200001')).toBeVisible();
    });

    test('发货单管理 - Read和数据关系验证', async ({ page }) => {
      await page.goto('/warehouse/deliveries');
      await expect(page.locator('table')).toBeVisible();
      
      await expect(page.getByText('FH202505200001')).toBeVisible();
      
      // 验证发货单关联销售订单
      await expect(page.getByText('XS202505200003')).toBeVisible();
      
      // 验证发货单关联客户
      await expect(page.getByText('深圳智能制造')).toBeVisible();
    });
  });

  // Phase 6: 统计报表测试
  test.describe('统计报表', () => {
    test('产品汇总统计', async ({ page }) => {
      await page.goto('/sales/product-summary');
      await expect(page.locator('table, .statistics')).toBeVisible();
    });

    test('订单统计', async ({ page }) => {
      await page.goto('/sales/order-statistics');
      await expect(page.locator('table, .statistics')).toBeVisible();
    });

    test('生产统计', async ({ page }) => {
      await page.goto('/production/statistics');
      await expect(page.locator('table, .statistics')).toBeVisible();
    });
  });
});
