# 完整数据集端到端测试规范

## Why
用户需要使用一套完整、真实的数据对整个ERP系统进行端到端测试，确保所有业务模块（销售、采购、生产、仓库、财务）的数据流转和功能完整性。

## What Changes

### 1. 测试数据集设计
- 设计完整的业务数据集，包括：客户、产品、供应商、物料、报价单、销售订单、采购订单、生产计划、仓库单据、应收账款、应付账款等
- 建立业务实体之间的关联关系
- 包含各种业务状态和场景

### 2. 测试场景覆盖
- **销售模块**：客户管理 → 报价单 → 销售订单 → 发货 → 应收账款 → 收款核销
- **采购模块**：供应商管理 → 采购订单 → 入库 → 应付款 → 付款核销
- **生产模块**：生产计划 → 领料 → 生产 → 成品入库
- **仓库模块**：多仓库调拨、库存查询
- **财务模块**：应收/应付账款管理、收款/付款核销

### 3. 数据持久化测试
- 验证 localStorage 数据持久化功能
- 测试数据在浏览器刷新后正确恢复
- 验证 CRUD 操作的数据正确性

## Impact

### Affected specs
- pre-launch-user-testing: 真实用户测试
- automated-testing: 自动化测试规范

### Affected code
- src/utils/dataStore.ts: 数据存储层
- src/utils/request.ts: 请求处理层
- src/views/*: 所有业务视图组件

## ADDED Requirements

### Requirement: 完整测试数据集
系统 SHALL 提供一套完整的测试数据集，包含以下业务实体：

#### Scenario: 销售完整流程数据
- **WHEN** 测试销售模块时
- **THEN** 应包含：3个客户、3个产品、2个报价单、3个销售订单（不同状态）

#### Scenario: 采购完整流程数据
- **WHEN** 测试采购模块时
- **THEN** 应包含：3个供应商、4个物料、2个采购订单（不同状态）

#### Scenario: 生产完整流程数据
- **WHEN** 测试生产模块时
- **THEN** 应包含：3个生产计划（待生产、生产中、已完成）

#### Scenario: 财务完整流程数据
- **WHEN** 测试财务模块时
- **THEN** 应包含：3个应收款（已付款、部分付款、未付款）、3个应付款

### Requirement: 端到端业务流程测试
系统 SHALL 支持完整业务流程测试：

#### Scenario: 报价单转订单
- **WHEN** 用户将报价单转换为销售订单
- **THEN** 订单数据正确创建，状态为待审核

#### Scenario: 销售订单审核
- **WHEN** 用户审核销售订单
- **THEN** 订单状态变更为已审核，可进行发货操作

#### Scenario: 采购订单入库
- **WHEN** 用户完成采购订单入库
- **THEN** 库存数量正确增加，应付款自动生成

#### Scenario: 应收账款核销
- **WHEN** 用户对部分应收款进行核销
- **THEN** 收款金额正确累加，状态更新为部分收款

### Requirement: 数据持久化验证
系统 SHALL 验证数据持久化功能：

#### Scenario: 数据保存验证
- **WHEN** 用户执行增删改操作
- **THEN** 数据自动保存到 localStorage，控制台显示保存日志

#### Scenario: 数据恢复验证
- **WHEN** 用户刷新浏览器页面
- **THEN** 所有数据从 localStorage 正确恢复

## MODIFIED Requirements

### Requirement: 数据初始化
**Modified from**: pre-launch-user-testing/spec.md
- **OLD**: 提供基础Mock数据
- **NEW**: 提供完整的业务数据集，包含所有业务模块的测试数据

## REMOVED Requirements
无
