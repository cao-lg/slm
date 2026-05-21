# ERP系统V2 - The Implementation Plan

## [ ] Task 1: 修复现有系统错误
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 修复 `rows is not iterable` 错误
  - 确保所有Mock数据返回正确格式
  - 检查并修复所有表格组件
- **Acceptance Criteria Addressed**: AC-1, AC-3
- **Test Requirements**:
  - `programmatic` TR-1.1: 销售订单、产品、供应商等表格可正常显示数据
  - `human-judgement` TR-1.2: 所有页面无控制台错误
- **Notes**: 主要问题在Mock数据返回格式

## [ ] Task 2: 完善Mock数据系统
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 更新所有Mock数据返回格式
  - 确保所有列表数据是数组格式
  - 补充缺失的Mock数据接口
- **Acceptance Criteria Addressed**: AC-3, AC-7
- **Test Requirements**:
  - `programmatic` TR-2.1: 所有Mock接口返回 { code: 200, data: ... }
  - `human-judgement` TR-2.2: 列表接口返回 data.list 数组
- **Notes**: request.ts 文件需要全面检查

## [ ] Task 3: 完善产品管理模块
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 更新产品表单字段，完全对齐数据字典
  - 添加产品详情页面
  - 确保ProductCode, ProductName, Category, Unit, Spec, Price, Cost, Status都有
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgement` TR-3.1: 产品编辑表单包含所有数据字典字段
  - `human-judgement` TR-3.2: 产品详情页面显示完整信息
- **Notes**: 参照数据字典第173-197行

## [ ] Task 4: 完善供应商管理模块
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 更新供应商表单字段，完全对齐数据字典
  - 添加供应商详情页面
  - 确保SupplierCode, SupplierName, Contact, Phone, Fax, Email, Address, Status都有
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgement` TR-4.1: 供应商编辑表单包含所有数据字典字段
  - `human-judgement` TR-4.2: 供应商详情页面显示完整信息
- **Notes**: 参照数据字典第147-169行

## [ ] Task 5: 完善客户管理模块
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 更新客户表单字段，完全对齐数据字典
  - 添加客户详情页面
  - 确保CustomerCode, CustomerName, Contact, Phone, Fax, Email, Address, Status都有
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgement` TR-5.1: 客户编辑表单包含所有数据字典字段
  - `human-judgement` TR-5.2: 客户详情页面显示完整信息
- **Notes**: 参照数据字典第121-143行

## [ ] Task 6: 创建销售订单详情页面
- **Priority**: P1
- **Depends On**: Task 2
- **Description**:
  - 新增 SalesOrderDetail.vue 页面
  - 显示订单基本信息
  - 显示订单明细表格
  - 支持从订单列表跳转进来
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgement` TR-6.1: 订单详情页显示完整信息和明细
  - `programmatic` TR-6.2: 路由正确配置
- **Notes**: 需要更新 router/index.ts

## [ ] Task 7: 创建采购订单详情页面
- **Priority**: P1
- **Depends On**: Task 6
- **Description**:
  - 新增 PurchaseOrderDetail.vue 页面
  - 显示采购订单基本信息
  - 显示采购订单明细表格
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgement` TR-7.1: 采购订单详情页显示完整信息和明细
- **Notes**: 同销售订单类似

## [ ] Task 8: 创建报价单详情页面
- **Priority**: P1
- **Depends On**: Task 7
- **Description**:
  - 新增 QuotationDetail.vue 页面
  - 显示报价单基本信息
  - 显示报价单明细表格
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgement` TR-8.1: 报价单详情页显示完整信息和明细
- **Notes**: 格式同订单详情页面

## [ ] Task 9: 完善所有订单表单
- **Priority**: P1
- **Depends On**: Task 6
- **Description**:
  - 更新销售订单表单，支持明细管理
  - 更新采购订单表单，支持明细管理
  - 更新报价单表单，支持明细管理
  - 所有明细都支持新增、编辑、删除
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgement` TR-9.1: 所有订单表单支持明细管理
  - `human-judgement` TR-9.2: 明细数据正确计算金额
- **Notes**: 合计金额需要自动计算

## [ ] Task 10: 完整用户测试
- **Priority**: P2
- **Depends On**: Tasks 1-9
- **Description**:
  - 完整测试所有模块
  - 验证所有功能正常工作
  - 确保无控制台错误
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
- **Test Requirements**:
  - `human-judgement` TR-10.1: 所有模块可正常访问和操作
  - `programmatic` TR-10.2: 整个流程无控制台错误
- **Notes**: 最终验收测试
