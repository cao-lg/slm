# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales.spec.ts >> 销售流程测试 >> 报价单可以转为销售订单
- Location: e2e/sales.spec.ts:43:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=销售管理')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - heading "ERP系统" [level=2] [ref=e7]
      - menubar [ref=e8]:
        - menuitem "销售" [ref=e9]:
          - generic [ref=e10] [cursor=pointer]:
            - generic [ref=e11]: 销售
            - img [ref=e13]
        - menuitem "采购" [ref=e15]:
          - generic [ref=e16] [cursor=pointer]:
            - generic [ref=e17]: 采购
            - img [ref=e19]
        - menuitem "生产" [ref=e21]:
          - generic [ref=e22] [cursor=pointer]:
            - generic [ref=e23]: 生产
            - img [ref=e25]
        - menuitem "仓库" [ref=e27]:
          - generic [ref=e28] [cursor=pointer]:
            - generic [ref=e29]: 仓库
            - img [ref=e31]
        - menuitem "产品" [ref=e33]:
          - generic [ref=e34] [cursor=pointer]:
            - generic [ref=e35]: 产品
            - img [ref=e37]
        - menuitem "财务" [ref=e39]:
          - generic [ref=e40] [cursor=pointer]:
            - generic [ref=e41]: 财务
            - img [ref=e43]
        - menuitem "设置" [ref=e45]:
          - generic [ref=e46] [cursor=pointer]:
            - generic [ref=e47]: 设置
            - img [ref=e49]
        - menuitem "退出系统" [ref=e52] [cursor=pointer]:
          - generic [ref=e53]: 退出系统
  - generic [ref=e54]:
    - generic [ref=e56]:
      - navigation "面包屑" [ref=e58]:
        - link "首页" [ref=e60]
      - button "陈立国" [ref=e63] [cursor=pointer]:
        - img [ref=e65]
        - generic [ref=e67]: 陈立国
    - main [ref=e68]:
      - generic [ref=e69]:
        - heading "欢迎使用ERP企业管理系统" [level=1] [ref=e70]
        - generic [ref=e71]:
          - generic [ref=e75]:
            - img [ref=e77]
            - generic [ref=e79]:
              - paragraph [ref=e80]: 客户
              - paragraph [ref=e81]: "4"
          - generic [ref=e85]:
            - img [ref=e87]
            - generic [ref=e91]:
              - paragraph [ref=e92]: 产品
              - paragraph [ref=e93]: "5"
          - generic [ref=e97]:
            - img [ref=e99]
            - generic [ref=e101]:
              - paragraph [ref=e102]: 销售订单
              - paragraph [ref=e103]: "4"
          - generic [ref=e107]:
            - img [ref=e109]
            - generic [ref=e113]:
              - paragraph [ref=e114]: 生产计划
              - paragraph [ref=e115]: "4"
        - generic [ref=e116]:
          - generic [ref=e118]:
            - generic [ref=e119]: 快捷操作
            - generic [ref=e121]:
              - button "销售订单" [ref=e122] [cursor=pointer]:
                - generic [ref=e123]: 销售订单
              - button "采购订单" [ref=e124] [cursor=pointer]:
                - generic [ref=e125]: 采购订单
              - button "生产计划" [ref=e126] [cursor=pointer]:
                - generic [ref=e127]: 生产计划
              - button "数据管理" [ref=e128] [cursor=pointer]:
                - generic [ref=e129]: 数据管理
          - generic [ref=e131]:
            - generic [ref=e132]: 系统信息
            - table [ref=e136]:
              - rowgroup [ref=e137]:
                - row "系统版本 v1.0.0" [ref=e138]:
                  - cell "系统版本" [ref=e139]
                  - cell "v1.0.0" [ref=e140]
                - row "当前用户 陈立国" [ref=e141]:
                  - cell "当前用户" [ref=e142]
                  - cell "陈立国" [ref=e143]
                - row "用户角色 管理员" [ref=e144]:
                  - cell "用户角色" [ref=e145]
                  - cell "管理员" [ref=e146]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('销售流程测试', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('http://localhost:3000/login');
  6  |     await page.fill('input[name="username"]', 'admin');
  7  |     await page.fill('input[name="password"]', 'admin123');
  8  |     await page.click('button:has-text("登 录")');
  9  |     await page.waitForURL('**/home');
  10 |   });
  11 | 
  12 |   test('用户可以创建报价单', async ({ page }) => {
  13 |     await page.click('text=销售管理');
  14 |     await page.click('text=报价单管理');
  15 |     
  16 |     await page.click('button:has-text("新增报价单")');
  17 |     
  18 |     await page.fill('input[name="quotationNo"]', 'TEST20260524001');
  19 |     await page.click('.el-form-item__label:has-text("客户") + .el-form-item__content .el-input__inner');
  20 |     await page.click('.el-select-dropdown__item:first-child');
  21 |     
  22 |     await page.click('button:has-text("添加明细")');
  23 |     await page.click('.el-table__body-wrapper .el-form-item__label:has-text("产品") + .el-form-item__content .el-input__inner');
  24 |     await page.click('.el-select-dropdown__item:first-child');
  25 |     
  26 |     await page.fill('.el-table__body-wrapper input[name="quantity"]', '10');
  27 |     
  28 |     await page.click('button:has-text("保存")');
  29 |     
  30 |     const successMessage = await page.locator('.el-message--success').textContent();
  31 |     expect(successMessage).toContain('保存成功');
  32 |   });
  33 | 
  34 |   test('用户可以查看销售订单列表', async ({ page }) => {
  35 |     await page.click('text=销售管理');
  36 |     await page.click('text=销售订单');
  37 |     
  38 |     await page.waitForSelector('.el-table');
  39 |     const tableRows = await page.locator('.el-table__row').count();
  40 |     expect(tableRows).toBeGreaterThan(0);
  41 |   });
  42 | 
  43 |   test('报价单可以转为销售订单', async ({ page }) => {
> 44 |     await page.click('text=销售管理');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  45 |     await page.click('text=报价单管理');
  46 |     
  47 |     await page.waitForSelector('.el-table__row');
  48 |     await page.click('.el-table__row:first-child .el-button--text:has-text("转订单")');
  49 |     
  50 |     await page.click('button:has-text("确认")');
  51 |     
  52 |     const successMessage = await page.locator('.el-message--success').textContent();
  53 |     expect(successMessage).toContain('转订单成功');
  54 |   });
  55 | });
```