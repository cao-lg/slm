# ERP系统浏览器自动化测试 - Product Requirement Document

## Overview
- **Summary**: 建立完整的 ERP 系统浏览器自动化测试体系，包括完整的测试数据准备、登录、销售流程、采购流程、生产流程、财务核销、仓库管理和系统管理的端到端测试
- **Purpose**: 解决之前自动化测试不完整的问题，通过真实的 Playwright 浏览器模拟完整用户操作流程，确保系统各模块功能正常
- **Target Users**: 开发人员、质量保证人员、系统上线前的验证人员

## Goals
- 建立完整的浏览器自动化测试数据准备机制
- 覆盖登录模块、销售流程、采购流程、生产流程、财务模块、仓库管理、系统管理的完整测试
- 确保测试数据可以在测试前重置，每次测试都有干净的起始状态
- 提供详细的测试报告和截图机制
- 确保所有主要业务流程都有自动化测试覆盖

## Non-Goals (Out of Scope)
- 后端接口集成测试（这次只关注前端浏览器端到端测试）
- 性能测试和压力测试
- 安全测试（XSS、SQL注入等）
- 移动端测试

## Background & Context
- ERP系统已使用localStorage进行完整数据持久化
- 已有Playwright配置框架和部分测试文件
- 现有测试文件可能存在元素定位不准确的问题
- 已准备完整的示例数据demoData.ts，可以用于测试数据准备

## Functional Requirements
- **FR-1**: 创建测试数据准备模块，支持在测试前注入预设数据
- **FR-2**: 完善登录模块自动化测试
- **FR-3**: 完善销售管理模块测试（客户、产品、报价单、销售订单）
- **FR-4**: 完善采购管理模块测试（供应商、物料、采购订单）
- **FR-5**: 完善生产管理模块测试（生产计划、配方）
- **FR-6**: 完善财务管理模块测试（应收应付、费用报销）
- **FR-7**: 完善仓库管理模块测试（发货单、领料单、调拨单、库存查询）
- **FR-8**: 完善系统管理模块测试（用户管理、消息通知、操作日志、数据管理）
- **FR-9**: 创建完整的测试套件和综合业务流程测试

## Non-Functional Requirements
- **NFR-1**: 所有测试必须可以在无头模式和正常浏览器模式运行
- **NFR-2**: 测试运行时间控制在合理范围内（单文件测试不超过2分钟）
- **NFR-3**: 提供详细的测试报告和失败截图
- **NFR-4**: 测试用例必须独立可重复运行（数据隔离）

## Constraints
- **Technical**: 必须使用现有的Playwright框架，不能引入新的大型测试库
- **Business**: 必须与现有localStorage数据存储兼容
- **Dependencies**: 依赖已有的demoData.ts作为测试数据源

## Assumptions
- 前端开发服务器可以在测试期间运行在localhost:3000
- localStorage在测试环境中可用
- Element Plus UI组件的结构相对稳定
- 所有页面路由都是可访问的

## Acceptance Criteria

### AC-1: 测试数据准备模块
- **Given**: Playwright测试环境已配置
- **When**: 测试套件启动
- **Then**: 可以通过localStorage注入完整的demo数据
- **Verification**: `programmatic`
- **Notes**: 需要在测试前清除并重置数据

### AC-2: 登录模块完整测试
- **Given**: 测试用户在数据库中存在
- **When**: 用户尝试各种登录情况（正确凭证、错误密码、空用户名、空密码）
- **Then**: 所有登录验证和页面跳转正常
- **Verification**: `programmatic`

### AC-3: 销售流程完整测试
- **Given**: 用户已登录系统
- **When**: 用户执行完整的销售流程（创建客户→创建产品→创建报价单→转销售订单→查看订单）
- **Then**: 所有功能正常工作，数据正确保存
- **Verification**: `programmatic`

### AC-4: 采购流程测试
- **Given**: 用户已登录系统
- **When**: 用户执行采购流程（创建供应商→创建物料→创建采购订单）
- **Then**: 采购功能正常
- **Verification**: `programmatic`

### AC-5: 生产流程测试
- **Given**: 用户已登录系统
- **When**: 用户执行生产流程（创建生产计划→查看进度）
- **Then**: 生产功能正常
- **Verification**: `programmatic`

### AC-6: 财务核销测试
- **Given**: 用户已登录且存在业务单据
- **When**: 用户进行财务核销操作
- **Then**: 财务数据正确更新
- **Verification**: `programmatic`

### AC-7: 仓库管理测试
- **Given**: 用户已登录
- **When**: 用户进行仓库操作（发货、领料、库存查询）
- **Then**: 仓库操作正常
- **Verification**: `programmatic`

### AC-8: 系统管理测试
- **Given**: 用户已登录
- **When**: 用户进行系统管理操作（数据管理、查看操作日志）
- **Then**: 系统管理功能正常
- **Verification**: `programmatic`

### AC-9: 综合业务流程测试
- **Given**: 用户已登录
- **When**: 用户执行完整的业务闭环（从客户→订单→生产→发货→核销）
- **Then**: 完整业务流程可以正常完成
- **Verification**: `programmatic`

## Open Questions
- [ ] 无待解决问题
