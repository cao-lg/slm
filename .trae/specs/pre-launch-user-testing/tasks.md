# ERP系统上线前用户测试 - 实施计划（分解和优先级任务列表）

## [ ] 任务 1: 测试环境准备与系统启动
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 检查Docker环境可用性
  - 启动ERP系统（docker-compose up）
  - 验证系统正常启动
  - 确认测试数据正确加载
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: Docker Compose启动无错误
  - `programmatic` TR-1.2: 后端服务正常监听8080端口
  - `programmatic` TR-1.3: 前端页面正常访问
  - `programmatic` TR-1.4: 数据库有测试数据（10个客户）
- **Notes**: 使用默认用户CLG/258258258

## [ ] 任务 2: 第一轮测试 - 基础模块验证
- **Priority**: P0
- **Depends On**: 任务1
- **Description**: 
  - 登录功能测试
  - 客户管理模块测试
  - 产品管理模块测试
  - 供应商管理模块测试
  - 发现问题立即修复
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-6
- **Test Requirements**:
  - `programmatic` TR-2.1: 登录流程完整测试
  - `human-judgement` TR-2.2: 客户列表和详情页面显示正常
  - `programmatic` TR-2.3: 客户CRUD操作API正常
  - `human-judgement` TR-2.4: 产品分类筛选功能正常
  - `programmatic` TR-2.5: 表单验证触发并显示友好提示
- **Notes**: 重点测试之前修复的问题是否依然正常

## [ ] 任务 3: 第二轮测试 - 销售业务流程
- **Priority**: P0
- **Depends On**: 任务2
- **Description**: 
  - 报价单测试（创建、详情、转订单）
  - 销售订单测试（创建、状态流转）
  - 应收款自动生成测试
  - 信用额度管理测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-3, AC-5, AC-7
- **Test Requirements**:
  - `programmatic` TR-3.1: 报价单创建和详情查看
  - `programmatic` TR-3.2: 报价单转订单功能验证
  - `programmatic` TR-3.3: 销售订单状态流转（pending→approved→producing→shipped→completed）
  - `programmatic` TR-3.4: 信用额度正确占用和释放
  - `programmatic` TR-3.5: 应收款自动生成并与订单关联
  - `human-judgement` TR-3.6: 成本利润计算显示正确
- **Notes**: 完整测试一个销售订单的生命周期

## [ ] 任务 4: 第二轮测试 - 采购与库存流程
- **Priority**: P0
- **Depends On**: 任务2
- **Description**: 
  - 采购订单测试（创建、收货）
  - 入库单测试
  - 库存管理测试
  - 应付款自动生成测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-7
- **Test Requirements**:
  - `programmatic` TR-4.1: 采购订单创建和收货（完整收货）
  - `programmatic` TR-4.2: 采购订单部分收货和入库进度更新
  - `programmatic` TR-4.3: 应付款自动生成验证
  - `programmatic` TR-4.4: 库存扣减逻辑验证
  - `human-judgement` TR-4.5: 库存预警显示正确（≤10显示红色标签）
- **Notes**: 验证之前修复的入库重复记录和发货扣库存问题

## [ ] 任务 5: 第二轮测试 - 财务核销流程
- **Priority**: P0
- **Depends On**: 任务2
- **Description**: 
  - 应收款核销测试
  - 应付款核销测试
  - paymentDate和paymentMethod保存验证
  - 状态流转验证
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-5, AC-7
- **Test Requirements**:
  - `programmatic` TR-5.1: 应收款核销功能正常，paymentDate和paymentMethod正确保存
  - `programmatic` TR-5.2: 应付款核销功能正常，paymentDate和paymentMethod正确保存
  - `programmatic` TR-5.3: 状态从unpaid→partial→paid正确流转
  - `programmatic` TR-5.4: 核销后信用额度正确释放
  - `human-judgement` TR-5.5: 核销界面友好，操作流畅
- **Notes**: 重点验证之前修复的Payable前后端接口一致性问题

## [ ] 任务 6: 第三轮测试 - 完整业务流程集成
- **Priority**: P1
- **Depends On**: 任务3,4,5
- **Description**: 
  - 完整销售流程：客户→报价→订单→生产→发货→完成→收款
  - 完整采购流程：供应商→采购→收货→入库→付款
  - 交叉验证数据流一致性
  - 多模块协同测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-3, AC-7
- **Test Requirements**:
  - `programmatic` TR-6.1: 完整销售流程数据一致性验证
  - `programmatic` TR-6.2: 完整采购流程数据一致性验证
  - `programmatic` TR-6.3: 多模块操作后所有数据正确
  - `human-judgement` TR-6.4: 用户体验流畅，操作逻辑清晰

## [ ] 任务 7: 第四轮测试 - 问题修复验证与回归
- **Priority**: P1
- **Depends On**: 任务6
- **Description**: 
  - 回归测试所有已修复的问题
  - 验证没有引入新问题
  - 边缘场景和异常处理测试
  - 生成最终测试报告
- **Acceptance Criteria Addressed**: 所有AC
- **Test Requirements**:
  - `programmatic` TR-7.1: 所有P0问题功能正常
  - `programmatic` TR-7.2: 没有新的P0问题
  - `human-judgement` TR-7.3: 系统整体稳定性良好
  - `human-judgement` TR-7.4: 用户体验符合预期
- **Notes**: 进行最终的上线决策评估

## 任务依赖关系图
```
任务1 (环境准备)
    ↓
任务2 (基础模块)
    ↓
┌───┴───┐
↓       ↓
任务3  任务4  任务5 (并行)
│       │       │
└───┬───┘
    ↓
任务6 (完整流程)
    ↓
任务7 (回归与报告)
```
