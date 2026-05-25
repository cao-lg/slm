# 全面 localStorage 持久化 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 完善 demoData.ts，加入所有模块的示例数据
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 扩展 demoData.ts，加入系统管理模块的示例数据（用户、消息、操作日志、配置）
  - 加入仓库管理模块的完整数据（发货单、领料单、调拨单、退货单、库存）
  - 加入财务模块的报销数据
  - 加入生产模块的配方数据
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgement` TR-1.1: demoData.ts 包含所有业务模块的完整示例数据
  - `programmatic` TR-1.2: 数据结构符合现有 API 规范
- **Notes**: 确保数据类型与 request.ts 中现有返回格式一致

## [x] Task 2: 完善 dataStore.ts，支持所有业务模块
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 在 DataStore 接口中加入所有缺失的模块字段
  - 实现所有模块的 CRUD 方法（增删改查）
  - 确保所有数据变更都自动调用 saveToStorage()
- **Acceptance Criteria Addressed**: AC-1, AC-5
- **Test Requirements**:
  - `programmatic` TR-2.1: DataStore 接口包含所有业务模块
  - `programmatic` TR-2.2: 每个模块都有完整的 CRUD 方法
  - `human-judgement` TR-2.3: 所有修改操作都正确保存到 localStorage

## [x] Task 3: 完善 request.ts，覆盖所有 API 路径
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 检查旧 mock 文件中定义的所有 API 路径
  - 在 request.ts 中实现所有缺失的 API 路径处理
  - 确保所有 API 调用都正确调用 dataStore 方法
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-3.1: request.ts 覆盖所有 API 路径
  - `programmatic` TR-3.2: API 调用正确调用对应的 dataStore 方法

## [x] Task 4: 删除旧的 src/mock/ 目录文件
- **Priority**: P1
- **Depends On**: Task 3
- **Description**: 
  - 删除 src/mock/system.ts
  - 删除 src/mock/finance.ts
  - 删除 src/mock/warehouse.ts
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-4.1: src/mock/ 目录下的旧文件已删除
  - `human-judgement` TR-4.2: 代码库中没有引用这些已删除的文件

## [x] Task 5: 完整测试和验证
- **Priority**: P1
- **Depends On**: Task 3, Task 4
- **Description**: 
  - 测试所有模块的数据增删改查功能
  - 验证数据持久化（刷新页面后数据不丢失）
  - 运行项目测试，确保没有错误
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `human-judgement` TR-5.1: 所有模块的增删改查功能正常
  - `human-judgement` TR-5.2: 刷新页面后数据正确恢复
  - `programmatic` TR-5.3: 项目测试（npm test）无错误
