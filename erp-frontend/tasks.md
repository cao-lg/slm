# ERP 前端测试任务列表

## 任务进度

- [x] **Task 1**: 在 e2e 目录下创建 utils 文件夹和 test-helpers.ts 文件
  - 创建 utils 文件夹
  - 包含完整的演示数据
  - 实现数据注入函数
  - 实现登录辅助函数
  - 实现页面导航辅助函数
  - 实现测试数据清理函数

- [x] **Task 2**: 更新 e2e/login.spec.ts，使用 test-helpers 并优化元素定位
  - 为登录页面组件添加 data-testid 属性
  - 使用 test-helpers 进行数据准备和清理
  - 使用更稳定的 data-testid 定位器定位 Element Plus 组件
  - 确保登录成功、失败、空值等测试用例正常工作
  - 优化 test-helpers 中的 login 函数定位方式

- [x] **Task 3**: 查看销售管理相关的页面组件结构
  - 分析客户管理页面组件 (CustomerList.vue, CustomerDetail.vue)
  - 分析产品管理页面组件 (ProductList.vue, ProductDetail.vue)
  - 分析报价单管理页面组件 (QuotationList.vue, QuotationDetail.vue)
  - 分析销售订单管理页面组件 (SalesOrderList.vue, SalesOrderDetail.vue)

- [x] **Task 4**: 为销售管理页面组件添加 data-testid 属性
  - 为客户管理页面组件添加 data-testid 属性
  - 为产品管理页面组件添加 data-testid 属性
  - 为报价单管理页面组件添加 data-testid 属性
  - 为销售订单管理页面组件添加 data-testid 属性

- [x] **Task 5**: 创建完整的销售模块测试文件
  - 创建 customer.spec.ts：客户管理测试
  - 创建 product.spec.ts：产品管理测试
  - 创建 quotation.spec.ts：报价单管理测试
  - 创建 sales-order.spec.ts：销售订单管理测试
  - 创建 sales-workflow.spec.ts：完整销售流程测试
  - 所有测试使用 test-helpers
  - 所有测试使用 data-testid 定位元素

- [x] **Task 6**: 更新 checklist.md，标记销售相关项
  - 更新客户管理模块测试状态
  - 更新产品管理模块测试状态
  - 更新销售流程模块测试状态
  - 更新优化和改进项状态

- [x] **Task 7**: 采购管理模块测试
  - 为采购管理页面组件添加 data-testid 属性
  - 创建 purchase.spec.ts：供应商管理、采购订单、原材料管理测试

- [x] **Task 8**: 生产管理模块测试
  - 为生产管理页面组件添加 data-testid 属性
  - 创建 production.spec.ts：生产计划、配方管理、生产统计测试

- [x] **Task 9**: 财务管理模块测试
  - 为财务管理页面组件添加 data-testid 属性
  - 创建 finance.spec.ts：应收款、应付款、费用管理测试

- [x] **Task 10**: 仓库管理模块测试
  - 为仓库管理页面组件添加 data-testid 属性
  - 创建 warehouse.spec.ts：库存、发货、领料、调拨、退货管理测试

- [x] **Task 11**: 系统管理模块测试
  - 为系统管理页面组件添加 data-testid 属性
  - 创建 system.spec.ts：用户、消息、日志、数据、密码管理测试

- [x] **Task 12**: 综合业务流程测试
  - 创建 complete-workflow.spec.ts：完整业务流程端到端测试

- [x] **Task 13**: 更新 Playwright 配置和测试运行
  - 优化 playwright.config.ts 配置
  - 添加多个浏览器支持
  - 改进测试报告配置
  - 增强错误捕获和调试能力

- [x] **Task 14**: 创建完整的测试文档
  - 创建 README-TESTING.md 文档
  - 包含测试运行说明
  - 包含测试架构说明
  - 包含测试最佳实践
