# ERP系统V2 - Product Requirement Document

## Overview
- **Summary**: 完善和重构现有ERP系统，修复所有错误并完全对齐数据字典，补充缺失的功能模块和详情页面
- **Purpose**: 解决现有系统的BUG，确保所有字段与数据字典一致，补充订单详情、产品详情、供应商详情等二级功能
- **Target Users**: ERP系统用户

## Goals
- 修复现有系统的 TypeError 和模块加载问题
- 确保所有前端表单、表格字段完全对齐数据字典
- 补充缺失的订单详情、产品详情、供应商详情等功能
- 完善Mock数据系统，确保所有模块可正常测试
- 提供完整的用户测试流程

## Non-Goals (Out of Scope)
- 后端API开发（本次仅处理前端）
- 数据库重构（仅对齐已有数据字典）
- 邮件系统模块（可选功能）

## Background & Context
当前系统存在以下问题：
1. 组件加载错误：`rows is not iterable` 导致表格无法显示
2. 字段不一致：产品、供应商等编辑表单字段与数据字典不完全对齐
3. 缺失详情页面：没有订单详情、产品详情等详情查看页面
4. Mock数据不完善：部分接口数据结构有问题

## Functional Requirements
- **FR-1**: 修复所有现有系统错误
  - 修复 `rows is not iterable` 错误
  - 修复模块动态加载错误
  - 修复Mock数据响应问题
- **FR-2**: 全面对齐数据字典
  - 所有表单字段与数据字典一致
  - 所有表格列与数据字典一致
  - 所有API接口类型与数据字典一致
- **FR-3**: 补充缺失的详情页面
  - 销售订单详情页面（含订单明细）
  - 采购订单详情页面（含订单明细）
  - 报价单详情页面（含报价明细）
  - 产品详情页面
  - 供应商详情页面
  - 客户详情页面
- **FR-4**: 完善所有模块的新增/编辑功能
  - 产品新增/编辑表单对齐数据字典
  - 供应商新增/编辑表单对齐数据字典
  - 客户新增/编辑表单对齐数据字典
  - 所有订单表单支持明细管理
- **FR-5**: 完善Mock数据系统
  - 所有接口返回完整数据
  - Mock数据格式符合真实API规范

## Non-Functional Requirements
- **NFR-1**: 系统可正常登录并访问所有模块
- **NFR-2**: 所有表格可正常渲染和操作
- **NFR-3**: 所有表单可正常提交和验证

## Constraints
- **Technical**: Vue3 + Element Plus + TypeScript + Vite
- **Business**: 保持与现有系统的功能一致
- **Dependencies**: 依赖现有的数据字典文档

## Assumptions
- 数据字典文档是准确的
- Mock数据方式可以满足测试需求
- 不依赖后端真实API也可完整测试所有功能

## Acceptance Criteria

### AC-1: 系统启动无错误
- **Given**: 开发服务器已启动
- **When**: 访问 http://localhost:3000
- **Then**: 登录页面正常显示，控制台无错误
- **Verification**: `programmatic`

### AC-2: 登录功能正常
- **Given**: 用户在登录页面
- **When**: 输入用户名 CLG 和任意密码，点击登录
- **Then**: 成功跳转到首页，显示主界面
- **Verification**: `programmatic`

### AC-3: 销售订单列表无错误
- **Given**: 用户已登录
- **When**: 访问销售订单页面
- **Then**: 表格正常显示数据，无 `rows is not iterable` 错误
- **Verification**: `programmatic`

### AC-4: 产品编辑表单对齐数据字典
- **Given**: 用户在产品管理页面
- **When**: 点击新增或编辑产品
- **Then**: 表单字段与数据字典完全一致（ProductCode, ProductName, Category, Unit, Spec, Price, Cost, Status）
- **Verification**: `human-judgment`

### AC-5: 供应商编辑表单对齐数据字典
- **Given**: 用户在供应商管理页面
- **When**: 点击新增或编辑供应商
- **Then**: 表单字段与数据字典完全一致（SupplierCode, SupplierName, Contact, Phone, Fax, Email, Address, Status）
- **Verification**: `human-judgment`

### AC-6: 销售订单详情页面可用
- **Given**: 用户在销售订单列表
- **When**: 点击查看某个订单
- **Then**: 显示订单详情页面，包含订单信息和订单明细表格
- **Verification**: `human-judgment`

### AC-7: 所有模块可正常访问
- **Given**: 用户已登录
- **When**: 通过左侧菜单访问各个模块
- **Then**: 所有页面可正常加载，无控制台错误
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要完全重新设计所有表单组件？
- [ ] 是否需要修改后端实体类（已有后端不需要）？
