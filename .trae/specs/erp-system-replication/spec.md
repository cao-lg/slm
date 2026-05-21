# ERP系统复刻规格说明书

## 文档信息

| 项目 | 说明 |
|------|------|
| 文档名称 | ERP系统复刻规格说明书 |
| 版本 | 1.0 |
| 日期 | 2026-05-20 |
| 目标系统 | http://test.qg827.com/ |
| 复刻目标 | Vue 3 + Spring Boot + MySQL |

---

## 1. 复刻概述

### 1.1 复刻目标

将现有ASP+Access ERP系统完整复刻到新技术栈，保留所有功能、字段、数据流和用户体验。

### 1.2 复刻范围

| 模块 | 功能页面 | ASP文件 | 数据表 |
|------|----------|---------|--------|
| 销售管理 | 报价单、销售订单、产品汇总、订单统计、客户管理 | ProksBJ, HTPI, HTPIcp, HTPIFXcp, PIKH | SalesOrder, Customer, Quotation |
| 采购管理 | 采购订单、原材料、供应商管理 | CG, Products, SUP | PurchaseOrder, Supplier |
| 生产管理 | 生产计划、配方单、生产统计 | SC, SCcp, SCFX | ProductionPlan, Recipe |
| 仓库管理 | 车间仓、发货单、成品仓、调拨单、材料仓、领料单、外仓、待处理仓、退货单 | KCA, KCFH, KCB, KCTP, KCC, LD, KCD, KCE | Inventory, Warehouse |
| 产品管理 | 产品列表 | Products | Product |
| 财务管理 | 应收管理、应付管理、报销管理 | OAS, OAF, baoxiao | Receivable, Payable, Expense |
| 系统管理 | 站内通知、界面管理、用户列表、密码修改 | adminSMS, face, Admin_AdminList, Admin_AdminModifyPwd | User, Message |

### 1.3 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                    前端层 (Vue 3 + TypeScript)              │
│  - Vue 3 Composition API                                   │
│  - Vue Router 4                                             │
│  - Pinia 状态管理                                           │
│  - Element Plus UI                                          │
│  - Axios HTTP客户端                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    后端层 (Spring Boot)                     │
│  - Spring Boot 3.x                                         │
│  - Spring Security + JWT                                   │
│  - MyBatis Plus                                            │
│  - Redis 缓存                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据层 (MySQL 8.0)                       │
│  - 18张核心业务表                                           │
│  - 主从复制支持                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 复刻要求

### 2.1 功能完整性

- **必须**保留原系统所有24个功能页面
- **必须**保留原系统所有表单字段
- **必须**保留原系统所有业务逻辑
- **必须**保留原系统所有数据校验规则

### 2.2 数据一致性

| 对齐项 | 要求 |
|--------|------|
| 字段名称 | 与原系统完全一致 |
| 字段类型 | 与原系统完全一致 |
| 字段长度 | 与原系统完全一致 |
| 业务规则 | 与原系统完全一致 |
| 状态流转 | 与原系统完全一致 |

### 2.3 用户体验

- **必须**保持原系统操作习惯
- **必须**保持原系统界面布局
- **必须**保持原系统交互方式

---

## 3. 项目结构

### 3.1 后端项目结构

```
erp-backend/
├── src/main/java/com/erp/
│   ├── ErpApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   └── RedisConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── sales/
│   │   │   ├── QuotationController.java
│   │   │   ├── SalesOrderController.java
│   │   │   └── CustomerController.java
│   │   ├── purchase/
│   │   │   ├── PurchaseOrderController.java
│   │   │   ├── SupplierController.java
│   │   │   └── MaterialController.java
│   │   ├── production/
│   │   │   ├── ProductionPlanController.java
│   │   │   └── RecipeController.java
│   │   ├── warehouse/
│   │   │   ├── InventoryController.java
│   │   │   ├── WarehouseController.java
│   │   │   └── TransferController.java
│   │   ├── product/
│   │   │   └── ProductController.java
│   │   ├── finance/
│   │   │   ├── ReceivableController.java
│   │   │   ├── PayableController.java
│   │   │   └── ExpenseController.java
│   │   └── system/
│   │       ├── UserController.java
│   │       ├── MessageController.java
│   │       └── ConfigController.java
│   ├── service/
│   │   ├── impl/
│   │   └── *.java
│   ├── mapper/
│   │   └── *.java
│   ├── entity/
│   │   ├── Customer.java
│   │   ├── Supplier.java
│   │   ├── Product.java
│   │   ├── Warehouse.java
│   │   ├── SalesOrder.java
│   │   ├── PurchaseOrder.java
│   │   ├── ProductionPlan.java
│   │   ├── Recipe.java
│   │   ├── Inventory.java
│   │   ├── Receivable.java
│   │   ├── Payable.java
│   │   ├── Expense.java
│   │   ├── User.java
│   │   └── Message.java
│   ├── dto/
│   │   └── *.java
│   ├── vo/
│   │   └── *.java
│   └── common/
│       ├── Result.java
│       ├── Constants.java
│       └── ExceptionHandler.java
├── src/main/resources/
│   ├── application.yml
│   └── mapper/
│       └── *.xml
├── pom.xml
└── Dockerfile
```

### 3.2 前端项目结构

```
erp-frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── api/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── sales.ts
│   │   ├── purchase.ts
│   │   ├── production.ts
│   │   ├── warehouse.ts
│   │   ├── product.ts
│   │   ├── finance.ts
│   │   └── system.ts
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.vue
│   │   │   ├── SideMenu.vue
│   │   │   └── Header.vue
│   │   ├── Table/
│   │   │   ├── DataTable.vue
│   │   │   └── Pagination.vue
│   │   └── Form/
│   │       ├── BaseForm.vue
│   │       └── DetailTable.vue
│   ├── views/
│   │   ├── Login.vue
│   │   ├── Home.vue
│   │   ├── sales/
│   │   │   ├── QuotationList.vue
│   │   │   ├── SalesOrderList.vue
│   │   │   ├── ProductSummary.vue
│   │   │   ├── OrderStatistics.vue
│   │   │   └── CustomerList.vue
│   │   ├── purchase/
│   │   │   ├── PurchaseOrderList.vue
│   │   │   ├── MaterialList.vue
│   │   │   └── SupplierList.vue
│   │   ├── production/
│   │   │   ├── ProductionPlanList.vue
│   │   │   ├── RecipeList.vue
│   │   │   └── ProductionStatistics.vue
│   │   ├── warehouse/
│   │   │   ├── WorkshopInventory.vue
│   │   │   ├── DeliveryNote.vue
│   │   │   ├── ProductInventory.vue
│   │   │   ├── TransferNote.vue
│   │   │   ├── MaterialInventory.vue
│   │   │   ├── PickList.vue
│   │   │   ├── ExternalInventory.vue
│   │   │   ├── PendingInventory.vue
│   │   │   └── ReturnNote.vue
│   │   ├── product/
│   │   │   └── ProductList.vue
│   │   ├── finance/
│   │   │   ├── ReceivableList.vue
│   │   │   ├── PayableList.vue
│   │   │   └── ExpenseList.vue
│   │   └── system/
│   │       ├── MessageList.vue
│   │       ├── InterfaceConfig.vue
│   │       ├── UserList.vue
│   │       └── PasswordChange.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   └── app.ts
│   ├── utils/
│   │   ├── request.ts
│   │   ├── storage.ts
│   │   └── format.ts
│   └── styles/
│       └── main.css
├── package.json
├── vite.config.ts
└── Dockerfile
```

---

## 4. 数据库设计

### 4.1 数据表清单

| 序号 | 表名 | 说明 | 主键 |
|------|------|------|------|
| 1 | customer | 客户表 | CustomerID |
| 2 | supplier | 供应商表 | SupplierID |
| 3 | product | 产品表 | ProductID |
| 4 | warehouse | 仓库表 | WarehouseID |
| 5 | quotation | 报价单表 | QuotationID |
| 6 | quotation_detail | 报价单明细表 | DetailID |
| 7 | sales_order | 销售订单表 | OrderID |
| 8 | sales_order_detail | 销售订单明细表 | DetailID |
| 9 | purchase_order | 采购订单表 | POID |
| 10 | purchase_order_detail | 采购订单明细表 | DetailID |
| 11 | production_plan | 生产计划表 | PlanID |
| 12 | recipe | 配方表 | RecipeID |
| 13 | inventory | 库存表 | InventoryID |
| 14 | receivable | 应收款表 | ReceivableID |
| 15 | payable | 应付款表 | PayableID |
| 16 | expense | 报销表 | ExpenseID |
| 17 | user | 用户表 | UserID |
| 18 | message | 站内消息表 | MessageID |
| 19 | operation_log | 操作日志表 | LogID |

### 4.2 核心表结构

#### 4.2.1 客户表 (customer)

```sql
CREATE TABLE `customer` (
  `CustomerID` INT NOT NULL AUTO_INCREMENT COMMENT '客户ID',
  `CustomerCode` VARCHAR(50) NOT NULL COMMENT '客户编号',
  `CustomerName` VARCHAR(200) NOT NULL COMMENT '客户名称',
  `Contact` VARCHAR(100) DEFAULT NULL COMMENT '联系人',
  `Phone` VARCHAR(50) DEFAULT NULL COMMENT '联系电话',
  `Fax` VARCHAR(50) DEFAULT NULL COMMENT '传真',
  `Email` VARCHAR(100) DEFAULT NULL COMMENT '电子邮箱',
  `Address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `Status` INT NOT NULL DEFAULT 1 COMMENT '状态：0禁用，1启用',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`CustomerID`),
  UNIQUE KEY `idx_code` (`CustomerCode`),
  KEY `idx_name` (`CustomerName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户表';
```

#### 4.2.2 销售订单表 (sales_order)

```sql
CREATE TABLE `sales_order` (
  `OrderID` INT NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `OrderNo` VARCHAR(50) NOT NULL COMMENT '订单编号',
  `CustomerID` INT NOT NULL COMMENT '客户ID',
  `OrderDate` DATETIME NOT NULL COMMENT '订单日期',
  `DeliveryDate` DATETIME DEFAULT NULL COMMENT '交货日期',
  `TotalAmount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '订单总额',
  `Status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态',
  `Creator` VARCHAR(50) DEFAULT NULL COMMENT '制单人',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`OrderID`),
  UNIQUE KEY `idx_no` (`OrderNo`),
  KEY `idx_customer` (`CustomerID`),
  KEY `idx_date` (`OrderDate`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售订单表';
```

---

## 5. API接口设计

### 5.1 认证接口

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| POST | /api/auth/login | 用户登录 | {username, password} |
| POST | /api/auth/logout | 用户登出 | - |
| GET | /api/auth/userinfo | 获取用户信息 | - |

**登录接口**

```typescript
// 请求
interface LoginRequest {
  username: string;
  password: string;
}

// 响应
interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    userInfo: {
      userId: number;
      username: string;
      realName: string;
      role: string;
    };
  };
}
```

### 5.2 销售管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/sales/quotations | 报价单列表 |
| POST | /api/sales/quotations | 创建报价单 |
| GET | /api/sales/quotations/:id | 报价单详情 |
| PUT | /api/sales/quotations/:id | 更新报价单 |
| DELETE | /api/sales/quotations/:id | 删除报价单 |
| GET | /api/sales/orders | 销售订单列表 |
| POST | /api/sales/orders | 创建销售订单 |
| GET | /api/sales/orders/:id | 销售订单详情 |
| PUT | /api/sales/orders/:id | 更新销售订单 |
| DELETE | /api/sales/orders/:id | 删除销售订单 |
| GET | /api/sales/customers | 客户列表 |
| POST | /api/sales/customers | 创建客户 |
| GET | /api/sales/customers/:id | 客户详情 |
| PUT | /api/sales/customers/:id | 更新客户 |
| DELETE | /api/sales/customers/:id | 删除客户 |
| GET | /api/sales/summary | 产品汇总统计 |
| GET | /api/sales/statistics | 订单统计 |

### 5.3 采购管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/purchase/orders | 采购订单列表 |
| POST | /api/purchase/orders | 创建采购订单 |
| GET | /api/purchase/orders/:id | 采购订单详情 |
| PUT | /api/purchase/orders/:id | 更新采购订单 |
| DELETE | /api/purchase/orders/:id | 删除采购订单 |
| GET | /api/purchase/suppliers | 供应商列表 |
| POST | /api/purchase/suppliers | 创建供应商 |
| GET | /api/purchase/suppliers/:id | 供应商详情 |
| PUT | /api/purchase/suppliers/:id | 更新供应商 |
| DELETE | /api/purchase/suppliers/:id | 删除供应商 |
| GET | /api/purchase/materials | 原材料列表 |

### 5.4 生产管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/production/plans | 生产计划列表 |
| POST | /api/production/plans | 创建生产计划 |
| GET | /api/production/plans/:id | 生产计划详情 |
| PUT | /api/production/plans/:id | 更新生产计划 |
| DELETE | /api/production/plans/:id | 删除生产计划 |
| GET | /api/production/recipes | 配方单列表 |
| POST | /api/production/recipes | 创建配方单 |
| GET | /api/production/recipes/:id | 配方单详情 |
| PUT | /api/production/recipes/:id | 更新配方单 |
| DELETE | /api/production/recipes/:id | 删除配方单 |
| GET | /api/production/statistics | 生产统计 |

### 5.5 仓库管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/warehouse/inventory | 库存列表 |
| GET | /api/warehouse/inventory/:warehouseId | 按仓库库存 |
| POST | /api/warehouse/stock-in | 入库 |
| POST | /api/warehouse/stock-out | 出库 |
| GET | /api/warehouse/transfers | 调拨单列表 |
| POST | /api/warehouse/transfers | 创建调拨单 |
| GET | /api/warehouse/deliveries | 发货单列表 |
| POST | /api/warehouse/deliveries | 创建发货单 |
| GET | /api/warehouse/picks | 领料单列表 |
| POST | /api/warehouse/picks | 创建领料单 |
| GET | /api/warehouse/returns | 退货单列表 |
| POST | /api/warehouse/returns | 创建退货单 |

### 5.6 财务管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/finance/receivables | 应收款列表 |
| POST | /api/finance/receivables | 创建应收款 |
| PUT | /api/finance/receivables/:id | 更新应收款 |
| POST | /api/finance/receivables/:id/collect | 收款核销 |
| GET | /api/finance/payables | 应付款列表 |
| POST | /api/finance/payables | 创建应付款 |
| PUT | /api/finance/payables/:id | 更新应付款 |
| POST | /api/finance/payables/:id/pay | 付款核销 |
| GET | /api/finance/expenses | 报销列表 |
| POST | /api/finance/expenses | 创建报销 |
| PUT | /api/finance/expenses/:id | 更新报销 |
| POST | /api/finance/expenses/:id/approve | 审批报销 |

### 5.7 系统管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/system/users | 用户列表 |
| POST | /api/system/users | 创建用户 |
| GET | /api/system/users/:id | 用户详情 |
| PUT | /api/system/users/:id | 更新用户 |
| DELETE | /api/system/users/:id | 删除用户 |
| PUT | /api/system/users/:id/password | 修改密码 |
| GET | /api/system/messages | 消息列表 |
| POST | /api/system/messages | 发送消息 |
| PUT | /api/system/messages/:id/read | 标记已读 |
| GET | /api/system/configs | 系统配置 |
| PUT | /api/system/configs | 更新配置 |

---

## 6. 复刻优先级

### 6.1 第一阶段：基础框架（P0）

| 序号 | 功能 | 说明 |
|------|------|------|
| 1 | 项目初始化 | 创建前后端项目结构 |
| 2 | 数据库设计 | 创建18张表 |
| 3 | 用户认证 | 登录、登出、JWT |
| 4 | 基础组件 | 布局、表格、表单组件 |

### 6.2 第二阶段：核心业务（P0）

| 序号 | 模块 | 功能 |
|------|------|------|
| 1 | 客户管理 | CRUD |
| 2 | 供应商管理 | CRUD |
| 3 | 产品管理 | CRUD |
| 4 | 仓库管理 | 仓库基础数据 |

### 6.3 第三阶段：业务单据（P0）

| 序号 | 模块 | 功能 |
|------|------|------|
| 1 | 销售管理 | 报价单、销售订单 |
| 2 | 采购管理 | 采购订单 |
| 3 | 生产管理 | 生产计划、配方单 |
| 4 | 仓库管理 | 入库、出库、调拨 |
| 5 | 财务管理 | 应收、应付、报销 |

### 6.4 第四阶段：统计报表（P1）

| 序号 | 功能 | 说明 |
|------|------|------|
| 1 | 产品汇总 | 销售产品汇总 |
| 2 | 订单统计 | 订单分析 |
| 3 | 生产统计 | 生产分析 |

### 6.5 第五阶段：系统功能（P1）

| 序号 | 功能 | 说明 |
|------|------|------|
| 1 | 站内通知 | 消息发布 |
| 2 | 界面管理 | 界面配置 |
| 3 | 操作日志 | 审计日志 |

---

## 7. 验收标准

### 7.1 功能验收

- [ ] 所有24个功能页面可正常访问
- [ ] 所有CRUD操作正常
- [ ] 所有业务逻辑正确
- [ ] 所有状态流转正确

### 7.2 数据验收

- [ ] 所有字段与原系统一致
- [ ] 所有数据校验规则生效
- [ ] 所有主外键关系正确

### 7.3 性能验收

- [ ] 页面响应时间 < 2秒
- [ ] 支持100并发用户
- [ ] 无明显性能瓶颈

### 7.4 兼容性验收

- [ ] Chrome 80+ 正常
- [ ] Firefox 75+ 正常
- [ ] Edge 80+ 正常

---

## 8. 部署方案

### 8.1 Docker部署

```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: erp2024
      MYSQL_DATABASE: erp_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: ./erp-backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis

  frontend:
    build: ./erp-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### 8.2 环境变量

| 变量 | 说明 | 示例值 |
|------|------|--------|
| DB_HOST | 数据库主机 | mysql |
| DB_PORT | 数据库端口 | 3306 |
| DB_NAME | 数据库名 | erp_db |
| DB_USER | 数据库用户 | root |
| DB_PASSWORD | 数据库密码 | erp2024 |
| REDIS_HOST | Redis主机 | redis |
| REDIS_PORT | Redis端口 | 6379 |
| JWT_SECRET | JWT密钥 | erp-jwt-secret-key |

---

## 9. 下一步

1. 确认复刻规格
2. 开始后端项目初始化
3. 开始前端项目初始化
4. 创建数据库表
5. 实现用户认证
6. 实现核心业务功能

---

**文档状态**：待确认

**版本**：1.0

**最后更新**：2026-05-20
