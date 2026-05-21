# ERP系统复刻任务清单

## 项目概述

| 项目 | 说明 |
|------|------|
| 目标 | 复刻 http://test.qg827.com/ ERP系统 |
| 技术栈 | Vue 3 + Spring Boot + MySQL |
| 功能模块 | 7个模块，24个功能页面 |

---

## 阶段一：项目初始化

### 1.1 后端项目初始化

- [x] 1.1.1 创建Spring Boot项目结构
  - [x] 创建Maven项目
  - [x] 配置pom.xml依赖
  - [x] 配置application.yml
  - [x] 配置Dockerfile

- [x] 1.1.2 创建包结构
  - [x] config包
  - [x] controller包
  - [x] service包
  - [x] mapper包
  - [x] entity包
  - [x] dto包
  - [x] common包

### 1.2 前端项目初始化

- [x] 1.2.1 创建Vue 3项目结构
  - [x] 使用Vite创建项目
  - [x] 配置package.json依赖
  - [x] 配置vite.config.ts
  - [x] 配置Dockerfile

- [x] 1.2.2 创建目录结构
  - [x] api目录
  - [x] components目录
  - [x] views目录
  - [x] router目录
  - [x] stores目录
  - [x] utils目录

### 1.3 数据库初始化

- [x] 1.3.1 创建数据库
  - [x] 创建erp_db数据库
  - [x] 配置字符集utf8mb4

- [x] 1.3.2 创建数据表
  - [x] customer表（客户表）
  - [x] supplier表（供应商表）
  - [x] product表（产品表）
  - [x] warehouse表（仓库表）
  - [x] quotation表（报价单表）
  - [x] quotation_detail表（报价单明细表）
  - [x] sales_order表（销售订单表）
  - [x] sales_order_detail表（销售订单明细表）
  - [x] purchase_order表（采购订单表）
  - [x] purchase_order_detail表（采购订单明细表）
  - [x] production_plan表（生产计划表）
  - [x] recipe表（配方表）
  - [x] inventory表（库存表）
  - [x] receivable表（应收款表）
  - [x] payable表（应付款表）
  - [x] expense表（报销表）
  - [x] user表（用户表）
  - [x] message表（站内消息表）
  - [x] operation_log表（操作日志表）

---

## 阶段二：基础框架开发

### 2.1 后端基础框架

- [x] 2.1.1 配置类
  - [x] SecurityConfig配置（JWT认证）
  - [x] CorsConfig配置（跨域）
  - [x] RedisConfig配置（缓存）

- [x] 2.1.2 通用类
  - [x] Result统一响应
  - [x] Constants常量类
  - [x] GlobalExceptionHandler全局异常处理

- [x] 2.1.3 工具类
  - [x] JWT工具类
  - [x] MD5加密工具（使用BCrypt）
  - [x] ID生成器

### 2.2 前端基础框架

- [x] 2.2.1 布局组件
  - [x] MainLayout主布局
  - [x] SideMenu侧边菜单
  - [x] Header顶部栏

- [x] 2.2.2 通用组件
  - [x] 基础CSS样式

- [x] 2.2.3 路由配置
  - [x] 路由守卫（登录验证）
  - [x] 路由配置（7个模块）

- [x] 2.2.4 状态管理
  - [x] auth状态（用户信息）
  - [x] Token存储

---

## 阶段三：用户认证功能

### 3.1 后端认证

- [x] 3.1.1 用户实体和Mapper
  - [x] User实体类
  - [x] UserMapper接口

- [x] 3.1.2 认证服务
  - [x] LoginService登录服务
  - [x] JwtService Token服务

- [x] 3.1.3 认证控制器
  - [x] AuthController登录接口
  - [x] 用户信息接口

### 3.2 前端认证

- [x] 3.2.1 登录页面
  - [x] Login.vue登录页
  - [x] 登录表单验证

- [x] 3.2.2 认证API
  - [x] auth.ts登录接口
  - [x] request.ts请求封装

- [x] 3.2.3 认证状态
  - [x] auth store
  - [x] Token存储

---

## 阶段三：用户认证功能

### 3.1 后端认证

- [ ] 3.1.1 用户实体和Mapper
  - [ ] User实体类
  - [ ] UserMapper接口

- [ ] 3.1.2 认证服务
  - [ ] LoginService登录服务
  - [ ] JwtService Token服务

- [ ] 3.1.3 认证控制器
  - [ ] AuthController登录接口
  - [ ] 用户信息接口

### 3.2 前端认证

- [ ] 3.2.1 登录页面
  - [ ] Login.vue登录页
  - [ ] 登录表单验证

- [ ] 3.2.2 认证API
  - [ ] auth.ts登录接口
  - [ ] request.ts请求封装

- [ ] 3.2.3 认证状态
  - [ ] auth store
  - [ ] Token存储

---

## 阶段四：销售管理模块

### 4.1 后端销售管理

- [x] 4.1.1 客户管理
  - [x] Customer实体
  - [x] CustomerMapper
  - [ ] CustomerService
  - [ ] CustomerController
  - [ ] CRUD接口

- [ ] 4.1.2 报价单管理
  - [ ] Quotation实体
  - [ ] QuotationDetail实体
  - [ ] QuotationMapper
  - [ ] QuotationService
  - [ ] QuotationController
  - [ ] CRUD接口

- [ ] 4.1.3 销售订单管理
  - [ ] SalesOrder实体
  - [ ] SalesOrderDetail实体
  - [ ] SalesOrderMapper
  - [ ] SalesOrderService
  - [ ] SalesOrderController
  - [ ] CRUD接口
  - [ ] 状态流转（已下单→生产中→已发货→已完成）

- [ ] 4.1.4 销售统计
  - [ ] 产品汇总查询
  - [ ] 订单统计查询

### 4.2 前端销售管理

- [x] 4.2.1 客户管理页面
  - [x] CustomerList.vue客户列表
  - [ ] CustomerForm.vue客户表单

- [x] 4.2.2 报价单页面
  - [x] QuotationList.vue报价单列表
  - [ ] QuotationForm.vue报价单表单

- [x] 4.2.3 销售订单页面
  - [x] SalesOrderList.vue销售订单列表
  - [ ] SalesOrderForm.vue销售订单表单

- [ ] 4.2.4 统计页面
  - [ ] ProductSummary.vue产品汇总
  - [ ] OrderStatistics.vue订单统计

### 4.3 销售API

- [x] 4.3.1 API接口
  - [x] sales.ts API封装
  - [x] 客户接口
  - [ ] 报价单接口
  - [ ] 销售订单接口

---

## 阶段五：采购管理模块

### 5.1 后端采购管理

- [ ] 5.1.1 供应商管理
  - [ ] Supplier实体
  - [ ] SupplierMapper
  - [ ] SupplierService
  - [ ] SupplierController
  - [ ] CRUD接口

- [ ] 5.1.2 采购订单管理
  - [ ] PurchaseOrder实体
  - [ ] PurchaseOrderDetail实体
  - [ ] PurchaseOrderMapper
  - [ ] PurchaseOrderService
  - [ ] PurchaseOrderController
  - [ ] CRUD接口
  - [ ] 状态流转（已下单→已收货→已完成）

- [ ] 5.1.3 原材料管理
  - [ ] 材料列表查询
  - [ ] 材料关联供应商

### 5.2 前端采购管理

- [ ] 5.2.1 供应商管理页面
  - [ ] SupplierList.vue供应商列表
  - [ ] SupplierForm.vue供应商表单

- [ ] 5.2.2 采购订单页面
  - [ ] PurchaseOrderList.vue采购订单列表
  - [ ] PurchaseOrderForm.vue采购订单表单

- [ ] 5.2.3 原材料页面
  - [ ] MaterialList.vue原材料列表

### 5.3 采购API

- [ ] 5.3.1 API接口
  - [ ] purchase.ts API封装
  - [ ] 供应商接口
  - [ ] 采购订单接口

---

## 阶段六：生产管理模块

### 6.1 后端生产管理

- [ ] 6.1.1 生产计划管理
  - [ ] ProductionPlan实体
  - [ ] ProductionPlanMapper
  - [ ] ProductionPlanService
  - [ ] ProductionPlanController
  - [ ] CRUD接口
  - [ ] 状态流转（待生产→生产中→已完成）

- [ ] 6.1.2 配方单管理
  - [ ] Recipe实体
  - [ ] RecipeMapper
  - [ ] RecipeService
  - [ ] RecipeController
  - [ ] CRUD接口

- [ ] 6.1.3 生产统计
  - [ ] 生产数据查询
  - [ ] 生产报表

### 6.2 前端生产管理

- [ ] 6.2.1 生产计划页面
  - [ ] ProductionPlanList.vue生产计划列表
  - [ ] ProductionPlanForm.vue生产计划表单

- [ ] 6.2.2 配方单页面
  - [ ] RecipeList.vue配方单列表
  - [ ] RecipeForm.vue配方单表单

- [ ] 6.2.3 生产统计页面
  - [ ] ProductionStatistics.vue生产统计

### 6.3 生产API

- [ ] 6.3.1 API接口
  - [ ] production.ts API封装

---

## 阶段七：仓库管理模块

### 7.1 后端仓库管理

- [ ] 7.1.1 仓库基础数据
  - [ ] Warehouse实体
  - [ ] WarehouseMapper
  - [ ] WarehouseService
  - [ ] WarehouseController

- [ ] 7.1.2 库存管理
  - [ ] Inventory实体
  - [ ] InventoryMapper
  - [ ] InventoryService
  - [ ] InventoryController
  - [ ] 按仓库查询库存
  - [ ] 库存预警

- [ ] 7.1.3 入库出库
  - [ ] 入库接口
  - [ ] 出库接口
  - [ ] 车间仓接口
  - [ ] 成品仓接口
  - [ ] 材料仓接口

- [ ] 7.1.4 调拨管理
  - [ ] 调拨单实体
  - [ ] 调拨接口
  - [ ] 调拨审核

- [ ] 7.1.5 发货管理
  - [ ] 发货单实体
  - [ ] 发货接口
  - [ ] 关联销售订单

- [ ] 7.1.6 领料管理
  - [ ] 领料单实体
  - [ ] 领料接口
  - [ ] 关联生产计划

- [ ] 7.1.7 其他仓库
  - [ ] 外仓管理
  - [ ] 待处理仓管理
  - [ ] 退货单管理

### 7.2 前端仓库管理

- [ ] 7.2.1 库存页面
  - [ ] WorkshopInventory.vue车间仓
  - [ ] ProductInventory.vue成品仓
  - [ ] MaterialInventory.vue材料仓

- [ ] 7.2.2 单据页面
  - [ ] DeliveryNote.vue发货单
  - [ ] TransferNote.vue调拨单
  - [ ] PickList.vue领料单
  - [ ] ReturnNote.vue退货单

- [ ] 7.2.3 其他页面
  - [ ] ExternalInventory.vue外仓
  - [ ] PendingInventory.vue待处理仓

### 7.3 仓库API

- [ ] 7.3.1 API接口
  - [ ] warehouse.ts API封装

---

## 阶段八：产品管理模块

### 8.1 后端产品管理

- [ ] 8.1.1 产品管理
  - [ ] Product实体
  - [ ] ProductMapper
  - [ ] ProductService
  - [ ] ProductController
  - [ ] CRUD接口
  - [ ] 产品分类

### 8.2 前端产品管理

- [ ] 8.2.1 产品页面
  - [ ] ProductList.vue产品列表
  - [ ] ProductForm.vue产品表单

### 8.3 产品API

- [ ] 8.3.1 API接口
  - [ ] product.ts API封装

---

## 阶段九：财务管理模块

### 9.1 后端财务管理

- [ ] 9.1.1 应收管理
  - [ ] Receivable实体
  - [ ] ReceivableMapper
  - [ ] ReceivableService
  - [ ] ReceivableController
  - [ ] CRUD接口
  - [ ] 收款核销
  - [ ] 状态流转

- [ ] 9.1.2 应付管理
  - [ ] Payable实体
  - [ ] PayableMapper
  - [ ] PayableService
  - [ ] PayableController
  - [ ] CRUD接口
  - [ ] 付款核销
  - [ ] 状态流转

- [ ] 9.1.3 报销管理
  - [ ] Expense实体
  - [ ] ExpenseMapper
  - [ ] ExpenseService
  - [ ] ExpenseController
  - [ ] CRUD接口
  - [ ] 审批流程
  - [ ] 状态流转

### 9.2 前端财务管理

- [ ] 9.2.1 应收页面
  - [ ] ReceivableList.vue应收列表
  - [ ] ReceivableForm.vue应收表单

- [ ] 9.2.2 应付页面
  - [ ] PayableList.vue应付列表
  - [ ] PayableForm.vue应付表单

- [ ] 9.2.3 报销页面
  - [ ] ExpenseList.vue报销列表
  - [ ] ExpenseForm.vue报销表单

### 9.3 财务API

- [ ] 9.3.1 API接口
  - [ ] finance.ts API封装

---

## 阶段十：系统管理模块

### 10.1 后端系统管理

- [ ] 10.1.1 用户管理
  - [ ] 用户CRUD
  - [ ] 密码修改
  - [ ] 状态管理

- [ ] 10.1.2 站内通知
  - [ ] Message实体
  - [ ] MessageService
  - [ ] MessageController
  - [ ] 消息发布
  - [ ] 消息查询

- [ ] 10.1.3 界面管理
  - [ ] 界面配置
  - [ ] 主题设置

- [ ] 10.1.4 操作日志
  - [ ] OperationLog实体
  - [ ] 日志记录
  - [ ] 日志查询

### 10.2 前端系统管理

- [ ] 10.2.1 用户页面
  - [ ] UserList.vue用户列表
  - [ ] UserForm.vue用户表单
  - [ ] PasswordChange.vue修改密码

- [ ] 10.2.2 消息页面
  - [ ] MessageList.vue消息列表
  - [ ] MessageForm.vue消息表单

- [ ] 10.2.3 配置页面
  - [ ] InterfaceConfig.vue界面配置

### 10.3 系统API

- [ ] 10.3.1 API接口
  - [ ] system.ts API封装

---

## 阶段十一：测试与部署

### 11.1 后端测试

- [ ] 11.1.1 单元测试
  - [ ] Service层测试
  - [ ] Controller层测试

- [ ] 11.1.2 接口测试
  - [ ] API接口验证
  - [ ] 业务逻辑验证

### 11.2 前端测试

- [ ] 11.2.1 功能测试
  - [ ] 页面功能测试
  - [ ] 表单验证测试

- [ ] 11.2.2 兼容性测试
  - [ ] Chrome测试
  - [ ] Firefox测试
  - [ ] Edge测试

### 11.3 部署

- [ ] 11.3.1 Docker配置
  - [ ] 后端Dockerfile
  - [ ] 前端Dockerfile
  - [ ] docker-compose.yml

- [ ] 11.3.2 环境配置
  - [ ] 开发环境
  - [ ] 生产环境

- [ ] 11.3.3 部署验证
  - [ ] 服务启动验证
  - [ ] 功能验证

---

## 任务依赖关系

```
阶段一（项目初始化）
    │
    ▼
阶段二（基础框架） ← 依赖阶段一
    │
    ▼
阶段三（用户认证） ← 依赖阶段二
    │
    ├──→ 阶段四（销售管理）
    ├──→ 阶段五（采购管理）
    ├──→ 阶段六（生产管理）
    ├──→ 阶段七（仓库管理）
    ├──→ 阶段八（产品管理）
    ├──→ 阶段九（财务管理）
    └──→ 阶段十（系统管理）
              │
              ▼
           阶段十一（测试部署）
```

---

## 核心功能优先级

| 优先级 | 功能 | 页面数 |
|--------|------|--------|
| P0 | 用户认证、基础框架 | - |
| P0 | 客户管理 | 1页 |
| P0 | 供应商管理 | 1页 |
| P0 | 产品管理 | 1页 |
| P0 | 销售订单管理 | 2页 |
| P0 | 采购订单管理 | 1页 |
| P0 | 生产计划管理 | 2页 |
| P0 | 仓库库存管理 | 3页 |
| P0 | 应收应付管理 | 2页 |
| P1 | 报价单管理 | 1页 |
| P1 | 统计报表 | 3页 |
| P1 | 系统管理 | 4页 |

---

**任务清单版本**：1.0

**最后更新**：2026-05-20

**下一步行动**：开始阶段一项目初始化
