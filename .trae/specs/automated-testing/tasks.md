# ERP系统 - 自动化测试任务清单

## [x] Task 1: 设置前端测试框架
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 安装Vitest、@vue/test-utils、jsdom等测试依赖
  - 配置Vitest配置文件
  - 更新package.json添加测试脚本
  - 创建测试目录结构
- **Acceptance Criteria Addressed**: AC-1, AC-8
- **Test Requirements**:
  - `programmatic` TR-1.1: package.json包含测试相关脚本 (test、test:coverage)
  - `programmatic` TR-1.2: vitest.config.ts配置文件已创建
  - `programmatic` TR-1.3: 测试目录 (src/__tests__/) 已创建
- **Notes**: 使用Vitest作为主要测试框架，结合@vue/test-utils进行组件测试

## [x] Task 2: 生成测试数据
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 创建统一的测试数据生成文件
  - 生成客户数据（5条+）
  - 生成产品数据（5条+）
  - 生成供应商数据（5条+）
  - 生成报价单数据（5条+）
  - 生成销售订单数据（5条+）
  - 生成采购订单数据（5条+）
  - 生成应收款数据（5条+）
  - 生成应付款数据（5条+）
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-2.1: 测试数据文件包含所有核心业务模块数据
  - `programmatic` TR-2.2: 每个模块至少5条测试数据
  - `programmatic` TR-2.3: 测试数据结构符合实际API响应
- **Notes**: 复用现有Mock数据结构，确保数据一致性

## [x] Task 3: 实现登录功能测试
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**:
  - 创建登录页面测试文件
  - 测试用户名/密码输入框
  - 测试登录按钮点击
  - 测试登录成功场景
  - 测试登录失败场景
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-3.1: 登录页面组件能正常挂载
  - `programmatic` TR-3.2: 用户名和密码输入功能正常
  - `programmatic` TR-3.3: 点击登录按钮触发相应动作
  - `programmatic` TR-3.4: 登录成功时正确跳转
  - `programmatic` TR-3.5: 登录失败时显示错误提示
- **Notes**: 使用测试数据中的用户凭证（admin/admin123）

## [x] Task 4: 实现客户管理测试
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**:
  - 创建客户列表测试
  - 创建客户新增测试
  - 创建客户编辑测试
  - 创建客户筛选测试
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-4.1: 客户列表组件能正常加载并显示
  - `programmatic` TR-4.2: 客户筛选功能正常工作
  - `programmatic` TR-4.3: 新增客户功能正常
  - `programmatic` TR-4.4: 编辑客户功能正常
- **Notes**: 测试所有客户管理页面功能

## [x] Task 5: 实现产品管理测试
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**:
  - 创建产品列表测试
  - 创建产品分类筛选测试
  - 创建产品价格计算验证测试
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-5.1: 产品列表能正常加载显示
  - `programmatic` TR-5.2: 产品分类筛选功能正常
  - `programmatic` TR-5.3: 产品价格和成本计算正确
- **Notes**: 验证产品列表的所有交互功能

## [x] Task 6: 实现销售流程测试
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**:
  - 测试报价单创建
  - 测试报价单转订单
  - 测试销售订单审核
  - 测试销售订单完成
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `programmatic` TR-6.1: 报价单创建功能正常
  - `programmatic` TR-6.2: 报价单能正确转成销售订单
  - `programmatic` TR-6.3: 销售订单审核能正确生成应收款
  - `programmatic` TR-6.4: 销售订单状态流转正常
- **Notes**: 端到端测试从报价单到收款的完整流程

## [x] Task 7: 实现财务核销测试
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**:
  - 测试应收款列表显示
  - 测试应收款核销功能
  - 测试应付款列表显示
  - 测试应付款核销功能
  - 验证付款日期和付款方式字段保存
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `programmatic` TR-7.1: 应收款列表正常加载
  - `programmatic` TR-7.2: 应收款核销功能正常
  - `programmatic` TR-7.3: 应付款列表正常加载
  - `programmatic` TR-7.4: 应付款核销功能正常
  - `programmatic` TR-7.5: paymentDate和paymentMethod字段正确保存
- **Notes**: 重点验证财务核销的正确性和数据一致性

## [x] Task 8: 运行完整测试并生成覆盖率报告
- **Priority**: P0
- **Depends On**: Tasks 3-7
- **Description**:
  - 运行所有测试
  - 验证测试通过率≥95%
  - 生成测试覆盖率报告
  - 验证核心业务模块覆盖率≥80%
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `programmatic` TR-8.1: 所有测试运行完成
  - `programmatic` TR-8.2: 核心业务流程测试通过率≥95%
  - `programmatic` TR-8.3: 测试覆盖率报告已生成
  - `programmatic` TR-8.4: 核心业务模块测试覆盖率≥80%
- **Notes**: 这是最终的测试验证任务
