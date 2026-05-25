# 全面 localStorage 持久化 - Product Requirement Document

## Overview
- **Summary**: 将 ERP 系统的所有业务数据和功能模块都实现 localStorage 持久化，确保刷新页面后数据不会丢失，所有模块的数据增删改查都有持久化支持
- **Purpose**: 解决系统部分功能模块数据没有持久化的问题，让所有数据都能通过 localStorage 保存和恢复
- **Target Users**: 所有 ERP 系统用户

## Goals
- 完善 dataStore.ts，覆盖所有缺失的业务模块
- 完善 request.ts，实现所有 API 请求的 dataStore 持久化
- 删除不再使用的旧 mock 文件
- 确保所有功能模块的增删改查都能持久化保存

## Non-Goals (Out of Scope)
- 后端接口对接
- 真实数据库连接
- 多用户数据隔离

## Background & Context
- 系统目前已有基础的 dataStore 实现，覆盖了部分业务模块
- request.ts 已有 API 拦截器框架，但仅实现了部分接口
- 旧的 src/mock/ 目录下有未使用的 mock 文件
- 缺失的模块包括：系统管理（用户、消息、操作日志、配置）、仓库管理（发货、领料、调拨、退货、库存）、部分财务模块（报销）、生产配方等

## Functional Requirements
- **FR-1**: 完善 dataStore.ts，支持所有业务模块的数据存储
- **FR-2**: 完善 request.ts，覆盖所有 API 路径的持久化实现
- **FR-3**: 删除旧的 src/mock/ 目录文件
- **FR-4**: 完善 demoData.ts，加入所有模块的示例数据
- **FR-5**: 确保所有增删改查操作都自动保存到 localStorage

## Non-Functional Requirements
- **NFR-1**: 页面刷新后所有数据都能正确恢复
- **NFR-2**: 数据保存和加载无明显性能问题
- **NFR-3**: 错误处理友好，不会导致数据损坏

## Constraints
- **Technical**: 仅使用 localStorage，不依赖其他存储库
- **Business**: 保持现有 API 接口规范不变

## Assumptions
- localStorage 在浏览器环境中可用
- 数据量不会超过 localStorage 限制（通常 5-10MB）

## Acceptance Criteria

### AC-1: dataStore 支持所有模块
- **Given**: 系统已完善 dataStore
- **When**: 访问任意业务模块
- **Then**: 该模块的增删改查功能都有对应的 dataStore 方法支持
- **Verification**: `programmatic`

### AC-2: request.ts 覆盖所有 API
- **Given**: 系统已完善 request.ts
- **When**: 发起任意 API 请求
- **Then**: 请求被正确拦截并调用 dataStore 进行持久化
- **Verification**: `programmatic`

### AC-3: 数据持久化正常
- **Given**: 用户对数据进行了增删改操作
- **When**: 刷新页面
- **Then**: 修改后的数据正确恢复
- **Verification**: `human-judgment`

### AC-4: 旧 mock 文件已删除
- **Given**: 完成所有代码更新
- **When**: 查看项目目录
- **Then**: src/mock/ 目录下的文件已删除
- **Verification**: `programmatic`

### AC-5: demoData 覆盖所有模块
- **Given**: demoData.ts 已完善
- **When**: 加载示例数据
- **Then**: 所有业务模块都有完整的示例数据
- **Verification**: `human-judgment`

## Open Questions
- 无
