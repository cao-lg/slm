# ERP 前端测试指南

## 概述

本文档介绍了 ERP 前端项目的测试框架、测试结构、如何运行测试以及最佳实践。

## 测试架构

### 技术栈

- **单元测试**: Vitest + @vue/test-utils
- **E2E 测试**: Playwright
- **UI 框架**: Vue 3 + Element Plus
- **包管理器**: npm

### 目录结构

```
erp-frontend/
├── e2e/                          # E2E 测试目录
│   ├── utils/
│   │   └── test-helpers.ts       # 测试辅助工具
│   ├── login.spec.ts             # 登录模块测试
│   ├── customer.spec.ts          # 客户管理测试
│   ├── product.spec.ts           # 产品管理测试
│   ├── quotation.spec.ts         # 报价单测试
│   ├── sales-order.spec.ts       # 销售订单测试
│   ├── sales-workflow.spec.ts    # 销售流程测试
│   ├── purchase.spec.ts          # 采购管理测试
│   ├── production.spec.ts        # 生产管理测试
│   ├── finance.spec.ts           # 财务管理测试
│   ├── warehouse.spec.ts         # 仓库管理测试
│   ├── system.spec.ts            # 系统管理测试
│   └── complete-workflow.spec.ts # 综合业务流程测试
├── src/__tests__/                # 单元和组件测试目录
├── playwright.config.ts          # Playwright 配置
├── package.json                  # 项目依赖和脚本
├── tasks.md                      # 任务列表
└── checklist.md                  # 测试检查清单
```

## 测试类型

### 1. 单元测试和组件测试

使用 Vitest 进行单元测试和组件测试，测试单个函数和组件的功能。

### 2. E2E 测试

使用 Playwright 进行端到端测试，模拟真实用户的操作流程。

## 安装依赖

确保已安装所有依赖：

```bash
npm install
```

## 运行测试

### 运行单元测试

```bash
npm run test
```

### 运行单元测试并生成覆盖率报告

```bash
npm run test:coverage
```

### 运行单元测试的 UI 模式

```bash
npm run test:ui
```

### 运行 E2E 测试

```bash
npm run test:e2e
```

### 运行 E2E 测试的 UI 模式（交互式调试）

```bash
npm run test:e2e:ui
```

### 查看 E2E 测试报告

```bash
npm run test:e2e:report
```

### 安装 Playwright 浏览器

第一次运行 E2E 测试前，需要安装浏览器：

```bash
npm run test:e2e:install
```

## E2E 测试详解

### 测试辅助工具 (test-helpers.ts)

`e2e/utils/test-helpers.ts` 提供了以下功能：

1. **演示数据注入**: `injectDemoData(page)` - 向页面注入完整的演示数据集
2. **登录辅助**: `login(page, username, password)` - 快速登录系统
3. **导航辅助**: `navigateTo(page, menuText)` - 导航到指定菜单
4. **数据清理**: `clearTestData(page)` - 清理测试数据
5. **等待页面加载**: `waitForPageLoad(page)` - 等待页面完全加载

### 演示数据

演示数据包含以下内容：
- 客户数据 (4条记录)
- 产品数据 (5条记录)
- 供应商数据 (4条记录)
- 原材料数据 (7条记录)
- 报价单数据 (4条记录)
- 销售订单数据 (4条记录)
- 采购订单数据 (3条记录)
- 生产计划数据 (4条记录)
- 配方数据 (4条记录)
- 应收款数据 (3条记录)
- 应付款数据 (3条记录)
- 用户数据 (5条记录)
- 消息数据 (4条记录)
- 操作日志数据 (8条记录)
- 仓库相关数据 (发货、领料、调拨、退货单等)

### 元素定位策略

我们使用 `data-testid` 属性来定位元素，这是最稳定的定位策略：

```typescript
// 好的做法
await page.fill('[data-testid="username-input"] input', 'admin');
await page.click('[data-testid="login-button"]');

// 避免使用
await page.fill('.el-input__inner', 'admin');  // 不稳定
await page.click('text=登录');  // 受语言影响
```

### 测试文件命名约定

- 模块测试: `{module}.spec.ts` (如 `customer.spec.ts`)
- 流程测试: `{module}-workflow.spec.ts` (如 `sales-workflow.spec.ts`)

## 测试配置

### Playwright 配置 (playwright.config.ts)

主要配置项：

- **测试目录**: `./e2e`
- **浏览器**: Chromium, Firefox, WebKit
- **基础 URL**: `http://localhost:3000`
- **重试策略**: 非 CI 环境重试 1 次，CI 环境重试 2 次
- **报告**: HTML 报告、列表报告、JSON 报告
- **调试**: 失败时保留 trace、截图和视频

### 环境配置

- **开发环境**: 默认配置
- **CI 环境**: 通过 `process.env.CI` 变量检测，调整并发和重试策略

## 最佳实践

### 1. 测试隔离

每个测试用例应该独立运行，不依赖其他测试用例的执行结果。

```typescript
test.beforeEach(async ({ page }) => {
  await injectDemoData(page);  // 每次测试前注入新数据
  await login(page);           // 每次测试前重新登录
});
```

### 2. 使用 Page Object Model (POM)

对于复杂的页面，创建 Page Object 来封装页面操作。

### 3. 保持测试快速

- 避免不必要的等待
- 使用适当的超时设置
- 并行运行测试

### 4. 有意义的断言

```typescript
// 好的做法
await expect(page.locator('[data-testid="customer-name"]')).toContainText('北京科技有限公司');

// 避免
await expect(page.locator('div').nth(5)).toBeVisible();
```

### 5. 测试失败的调试

当测试失败时：
1. 查看 HTML 报告: `npm run test:e2e:report`
2. 使用 UI 模式重新运行: `npm run test:e2e:ui`
3. 检查失败时的截图和 trace

## 测试检查清单

完整的测试检查清单见 `checklist.md` 文件，包含：
- 框架搭建状态
- 各模块测试完成情况
- 测试优化进展
- 未来改进计划

## 任务列表

任务列表见 `tasks.md` 文件，跟踪所有已完成和待完成的测试任务。

## 常见问题

### 1. 测试运行超时

确保开发服务器正在运行：
```bash
npm run dev
```

### 2. 测试不稳定

- 检查使用的定位器是否稳定（优先使用 `data-testid`）
- 增加适当的等待
- 检查测试数据是否一致

### 3. 浏览器未安装

运行:
```bash
npm run test:e2e:install
```

## 持续集成

测试可以集成到 CI/CD 流程中。关键配置：

```yaml
# GitHub Actions 示例
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npm run test:e2e:install

- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true
```

## 进一步阅读

- [Playwright 官方文档](https://playwright.dev/)
- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils 文档](https://test-utils.vuejs.org/)

## 更新记录

- 2026-05-25: 完成所有主要模块测试和综合流程测试，优化测试配置，完善文档
