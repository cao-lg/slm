# ERP系统 - 自动化测试规范

## Overview
- **Summary**: 为ERP系统设计并实现完整的自动化测试套件，包括单元测试、组件测试和完整业务流程的E2E测试
- **Purpose**: 确保系统质量、功能稳定性和可维护性，为持续集成/持续部署提供自动化测试支持
- **Target Users**: 开发团队、QA团队、DevOps工程师

## Goals
- 1. **建立完整的前端测试框架**: 安装配置Vitest和相关测试工具
- 2. **生成标准化测试数据**: 创建统一的、可复用的测试数据集
- 3. **实现核心功能测试**: 覆盖登录、客户管理、产品管理、销售流程、财务核销等核心模块
- 4. **实现端到端业务流程测试**: 验证从报价单到收款的完整销售流程
- 5. **提供测试运行和报告**: 支持本地测试、CI/CD集成测试和测试覆盖率报告

## Non-Goals (Out of Scope)
- 后端API单元测试（本规范仅针对前端测试）
- 性能测试和压力测试
- 移动端兼容性测试
- 第三方系统集成测试

## Background & Context
系统使用 Vue 3 + TypeScript + Vite 5.0 + Element Plus，已有完整的Mock数据系统在 `/workspace/erp-frontend/src/utils/request.ts` 中。

## Functional Requirements
- **FR-1**: 建立Vitest测试框架，支持单元测试、组件测试
- **FR-2**: 生成结构化的测试数据，覆盖所有核心业务模块
- **FR-3**: 实现登录认证功能测试
- **FR-4**: 实现客户管理模块测试（CRUD、状态管理）
- **FR-5**: 实现产品管理模块测试（分类、价格管理）
- **FR-6**: 实现销售流程测试（报价单→订单→发货→收款）
- **FR-7**: 实现财务核销测试（应收款、应付款）
- **FR-8**: 提供测试覆盖率报告，要求核心业务模块覆盖率80%+
- **FR-9**: 集成测试命令到package.json

## Non-Functional Requirements
- **NFR-1**: 测试运行速度：完整测试套件运行时间<10分钟
- **NFR-2**: 测试稳定性：核心业务流程测试通过率≥95%
- **NFR-3**: 可维护性：测试代码结构清晰，注释完整，命名规范
- **NFR-4**: 可扩展性：易于添加新的测试用例和模块

## Constraints
- **Technical**:
  - 使用Vitest作为前端测试框架
  - 使用Vue Test Utils进行组件测试
  - 测试代码使用TypeScript编写
- **Business**:
  - 遵循Mock数据结构定义
  - 测试数据不影响生产环境
- **Dependencies**:
  - Vue 3.4+
  - Vite 5.0+
  - Element Plus 2.5+

## Assumptions
- 假设前端已有的Mock数据系统可用且稳定
- 假设测试环境具有网络访问权限用于下载测试依赖
- 假设开发团队有基础的测试知识

## Acceptance Criteria

### AC-1: 测试框架设置
- **Given**: 项目已安装依赖
- **When**: 运行 `npm run test:install` 安装测试框架
- **Then**: 所有测试依赖（vitest、@vue/test-utils等）安装成功
- **Verification**: `programmatic`
- **Notes**: 验证package.json新增了测试相关脚本

### AC-2: 测试数据生成
- **Given**: 项目已准备
- **When**: 查看测试数据文件
- **Then**: 测试数据包含客户、产品、供应商、报价单、订单、应收/应付款等完整数据
- **Verification**: `programmatic`
- **Notes**: 每个模块至少5条测试数据

### AC-3: 登录功能测试
- **Given**: 登录页面组件已准备
- **When**: 运行登录测试
- **Then**:
  - 测试验证用户名/密码输入
  - 测试验证登录按钮点击
  - 测试验证登录成功跳转
  - 测试验证登录失败提示
- **Verification**: `programmatic`

### AC-4: 客户管理测试
- **Given**: 客户管理页面组件已准备
- **When**: 运行客户管理测试
- **Then**:
  - 测试验证客户列表加载
  - 测试验证客户筛选功能
  - 测试验证客户新增功能
  - 测试验证客户编辑功能
- **Verification**: `programmatic`

### AC-5: 产品管理测试
- **Given**: 产品管理页面组件已准备
- **When**: 运行产品管理测试
- **Then**:
  - 测试验证产品列表加载
  - 测试验证产品分类筛选
  - 测试验证产品价格计算
- **Verification**: `programmatic`

### AC-6: 销售流程测试
- **Given**: 销售流程相关页面组件已准备
- **When**: 运行销售流程E2E测试
- **Then**:
  - 测试验证报价单创建→转订单
  - 测试验证订单审核→生成应收款
  - 测试验证应收款核销→完成订单
- **Verification**: `programmatic`

### AC-7: 财务核销测试
- **Given**: 财务模块页面组件已准备
- **When**: 运行财务核销测试
- **Then**:
  - 测试验证应收款列表加载
  - 测试验证应收款核销功能
  - 测试验证应付款列表加载
  - 测试验证应付款核销功能
  - 测试验证付款日期和方式字段保存
- **Verification**: `programmatic`

### AC-8: 测试覆盖率
- **Given**: 完整测试套件运行
- **When**: 查看测试覆盖率报告
- **Then**: 核心业务模块测试覆盖率≥80%
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要实现E2E测试（使用Playwright）？
- [ ] 测试覆盖率阈值是否需要调整？
- [ ] 是否需要集成到CI/CD流程？
