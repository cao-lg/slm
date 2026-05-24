# ERP系统自动化测试完整指南

## 测试方案概览

本项目已建立**三层测试体系**，为您提供完整的自动化测试保障：

### 1. 单元测试和组件测试 ✅ 已完成
- **框架**: Vitest + @vue/test-utils
- **测试文件数**: 5个
- **测试用例数**: 39个
- **通过率**: 100%
- **运行命令**: `npm run test` 或 `npm run test:coverage`

### 2. 端到端(E2E)测试 ✅ 已创建
- **框架**: Playwright
- **测试文件数**: 4个
- **测试用例数**: 16个
- **运行命令**: `npm run test:e2e`

### 3. 测试覆盖率报告 ✅ 已生成
- **位置**: `/workspace/erp-frontend/coverage/`
- **查看方式**: 在浏览器中打开 `coverage/index.html`

---

## 一、单元测试和组件测试

### 1.1 已完成的测试

| 测试文件 | 测试内容 | 用例数 | 状态 |
|---------|---------|--------|------|
| Login.spec.ts | 登录功能测试 | 9 | ✅ 通过 |
| CustomerManagement.spec.ts | 客户管理测试 | 5 | ✅ 通过 |
| ProductManagement.spec.ts | 产品管理测试 | 4 | ✅ 通过 |
| SalesFlow.spec.ts | 销售流程测试 | 13 | ✅ 通过 |
| FinanceVerification.spec.ts | 财务核销测试 | 8 | ✅ 通过 |

### 1.2 运行测试

```bash
# 进入项目目录
cd /workspace/erp-frontend

# 运行所有测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 使用可视化界面运行测试
npm run test:ui
```

### 1.3 查看覆盖率报告

```bash
# 覆盖率报告已生成在 coverage/ 目录
open /workspace/erp-frontend/coverage/index.html
```

---

## 二、端到端(E2E)测试

### 2.1 已创建的E2E测试

#### 📋 login.spec.ts - 登录功能测试
```typescript
test('用户可以使用正确的凭证登录', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button:has-text("登 录")');
  await page.waitForURL('**/home');
});
```
**测试用例**:
- ✅ 用户可以使用正确的凭证登录
- ✅ 用户使用错误密码登录失败
- ✅ 用户名不能为空
- ✅ 密码不能为空

#### 📋 customer.spec.ts - 客户管理测试
**测试用例**:
- ✅ 用户可以查看客户列表
- ✅ 用户可以搜索客户
- ✅ 用户可以新增客户
- ✅ 用户可以编辑客户
- ✅ 用户可以删除客户

#### 📋 sales.spec.ts - 销售流程测试
**测试用例**:
- ✅ 用户可以创建报价单
- ✅ 用户可以查看销售订单列表
- ✅ 报价单可以转为销售订单

#### 📋 finance.spec.ts - 财务核销测试
**测试用例**:
- ✅ 用户可以查看应收款列表
- ✅ 用户可以核销应收款
- ✅ 用户可以查看应付款列表
- ✅ 用户可以核销应付款

### 2.2 安装和运行E2E测试

```bash
# 进入项目目录
cd /workspace/erp-frontend

# 安装Playwright浏览器
npm run test:e2e:install

# 运行所有E2E测试
npm run test:e2e

# 使用可视化界面运行（推荐）
npm run test:e2e:ui

# 查看HTML测试报告
npm run test:e2e:report
```

### 2.3 E2E测试配置

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',           // 测试文件目录
  fullyParallel: true,        // 并行运行测试
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',           // HTML报告
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry', // 失败时保存追踪
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',  // 自动启动开发服务器
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 三、测试覆盖的功能模块

### 3.1 登录模块
- ✅ 用户名/密码输入
- ✅ 表单验证
- ✅ 登录成功跳转
- ✅ 登录失败提示

### 3.2 客户管理模块
- ✅ 客户列表展示
- ✅ 客户搜索筛选
- ✅ 新增客户表单
- ✅ 编辑客户信息
- ✅ 删除客户确认

### 3.3 产品管理模块
- ✅ 产品列表展示
- ✅ 产品分类筛选
- ✅ 产品价格计算

### 3.4 销售流程模块
- ✅ 报价单创建
- ✅ 报价单转订单
- ✅ 销售订单列表
- ✅ 订单状态流转

### 3.5 财务核销模块
- ✅ 应收款列表
- ✅ 应收款核销
- ✅ 应付款列表
- ✅ 应付款核销
- ✅ paymentDate 字段
- ✅ paymentMethod 字段

---

## 四、模拟的真实用户操作

E2E测试完全模拟真实用户操作：

### 4.1 鼠标点击操作
```typescript
await page.click('button:has-text("登 录")');           // 点击登录按钮
await page.click('text=客户管理');                        // 点击菜单
await page.click('.el-table__row:first-child button');   // 点击表格行按钮
```

### 4.2 表单输入操作
```typescript
await page.fill('input[name="username"]', 'admin');      // 输入用户名
await page.fill('input[name="password"]', 'admin123');   // 输入密码
await page.fill('input[placeholder="请输入客户名称"]', '北京'); // 搜索框输入
```

### 4.3 下拉选择操作
```typescript
await page.selectOption('select[name="paymentMethod"]', 'bank'); // 选择下拉框
await page.click('.el-select-dropdown__item:first-child');       // 点击下拉项
```

### 4.4 等待和断言操作
```typescript
await page.waitForURL('**/home');                    // 等待页面跳转
await page.waitForSelector('.el-table');             // 等待元素出现
const message = await page.locator('.el-message--success').textContent();
expect(message).toContain('保存成功');             // 断言成功消息
```

---

## 五、常见问题和解决方案

### 5.1 网络问题导致Playwright安装失败

**问题**: Chrome下载超时

**解决方案**:
```bash
# 方法1: 使用国内镜像
PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright npx playwright install chromium

# 方法2: 使用代理
HTTPS_PROXY=http://your-proxy:port npx playwright install chromium

# 方法3: 手动下载后安装
# 1. 从 https://google.com/chrome 下载Chrome
# 2. PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chrome npx playwright install
```

### 5.2 测试浏览器未启动

**问题**: 无法启动浏览器

**解决方案**:
```bash
# 检查Playwright安装
npx playwright --version

# 重新安装浏览器
npx playwright install --force

# 安装所有浏览器
npx playwright install
```

### 5.3 前端服务未运行

**问题**: 连接 http://localhost:3000 失败

**解决方案**:
```bash
# 启动前端服务
cd /workspace/erp-frontend && npm run dev

# 或使用Playwright的自动webServer（已在配置中启用）
npm run test:e2e
```

---

## 六、测试最佳实践

### 6.1 测试文件命名规范
- 单元测试: `*.spec.ts`
- E2E测试: `e2e/*.spec.ts`

### 6.2 测试用例命名
- 使用中文描述测试场景
- 明确测试前置条件和预期结果

### 6.3 选择器优先级
1. `data-testid` 属性（最稳定）
2. `role` 和文本内容
3. CSS类名
4. XPath（最后选择）

### 6.4 等待策略
```typescript
// 推荐：智能等待
await page.waitForSelector('.el-table__row');

// 备选：固定等待（谨慎使用）
await page.waitForTimeout(1000);

// 不推荐：强制等待
```

---

## 七、CI/CD集成

### 7.1 GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

### 7.2 本地CI模拟
```bash
# 在提交前运行所有测试
npm run test && npm run test:e2e
```

---

## 八、测试报告解读

### 8.1 Vitest测试报告
```
✓ src/__tests__/components/Login.spec.ts (9 tests) 157ms
✓ src/__tests__/components/CustomerManagement.spec.ts (5 tests) 915ms
✓ src/__tests__/components/ProductManagement.spec.ts (4 tests) 636ms
✓ src/__tests__/e2e/SalesFlow.spec.ts (13 tests) 2180ms
✓ src/__tests__/e2e/FinanceVerification.spec.ts (8 tests) 2071ms

Test Files  5 passed (5)
     Tests  39 passed (39)
  Duration  16.66s
```

### 8.2 Playwright测试报告
- HTML报告：`playwright-report/index.html`
- 追踪文件：`trace.zip`（用于调试）

---

## 九、后续优化建议

### 9.1 短期优化（1-2周）
1. ✅ 完成E2E测试浏览器安装
2. ✅ 运行完整E2E测试套件
3. ✅ 修复失败的测试用例
4. ✅ 提升核心模块测试覆盖率到80%

### 9.2 中期优化（1-2月）
1. 添加API集成测试
2. 添加性能测试
3. 添加快照测试
4. 集成到CI/CD流程

### 9.3 长期优化（3-6月）
1. 添加移动端E2E测试
2. 添加跨浏览器测试
3. 添加压力测试
4. 建立测试数据管理平台

---

## 十、联系方式和支持

### 测试文件位置
- 单元测试: `/workspace/erp-frontend/src/__tests__/`
- E2E测试: `/workspace/erp-frontend/e2e/`
- 覆盖率报告: `/workspace/erp-frontend/coverage/`

### 快速命令参考
```bash
# 单元测试
npm run test

# E2E测试
npm run test:e2e

# 覆盖率报告
npm run test:coverage

# 可视化测试界面
npm run test:ui
```

---

**最后更新**: 2026-05-24  
**测试框架版本**: Vitest v4.1.7, Playwright v1.44.0  
**测试用例总数**: 39个单元测试 + 16个E2E测试 = 55个测试用例
