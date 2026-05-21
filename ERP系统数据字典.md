# ERP系统数据字典

> **生成时间**: 2026-05-20  
> **数据库版本**: MySQL 8.0  
> **字符集**: utf8mb4_unicode_ci

---

## 目录

1. [系统概述](#一系统概述)
2. [数据表索引](#二数据表索引)
3. [表结构详细说明](#三表结构详细说明)
4. [字段类型说明](#四字段类型说明)
5. [索引说明](#五索引说明)
6. [附录](#附录)

---

## 一、系统概述

### 1.1 系统模块

本ERP系统包含以下核心模块：

| 模块 | 数据表 | 说明 |
|------|--------|------|
| 系统管理 | user, message, operation_log | 用户、消息、操作日志 |
| 销售管理 | customer, quotation, quotation_detail, sales_order, sales_order_detail, receivable | 客户、报价、销售订单、应收 |
| 采购管理 | supplier, material, material_supplier, purchase_order, purchase_order_detail, payable | 供应商、原材料、原材料供应商关联、采购订单、应付 |
| 产品管理 | product | 产品信息 |
| 生产管理 | production_plan, recipe | 生产计划、配方 |
| 仓库管理 | warehouse, inventory, delivery_note, pick_note, return_note, transfer_note | 仓库、库存、单据 |
| 财务管理 | expense | 报销管理 |

### 1.2 数据表关系图

```
用户表 (user) ─┐
               ├─> 站内消息 (message)
               ├─> 操作日志 (operation_log)
               └─> 报销 (expense)
                       
客户表 (customer) ─┐
                   ├─> 报价单 (quotation)
                   │       └─> 报价单明细 (quotation_detail)
                   ├─> 销售订单 (sales_order)
                   │       └─> 销售订单明细 (sales_order_detail)
                   └─> 应收款 (receivable)
                       
供应商表 (supplier) ─┐
                     ├─> 采购订单 (purchase_order)
                     │       └─> 采购订单明细 (purchase_order_detail)
                     └─> 应付款 (payable)
                       
产品表 (product) ─┬─> 库存 (inventory)
                  ├─> 配方 (recipe)
                  └─> 各种订单明细
                       
仓库表 (warehouse) ─┐
                   └─> 库存 (inventory)
```

---

## 二、数据表索引

| 序号 | 表名 | 中文名称 | 记录数预估 | 关键字段 |
|------|------|----------|-----------|---------|
| 1 | user | 用户表 | ≤100 | UserID, UserName |
| 2 | customer | 客户表 | ≤10,000 | CustomerID, CustomerCode |
| 3 | supplier | 供应商表 | ≤5,000 | SupplierID, SupplierCode |
| 4 | product | 产品表 | ≤10,000 | ProductID, ProductCode |
| 5 | warehouse | 仓库表 | ≤50 | WarehouseID, WarehouseCode |
| 6 | quotation | 报价单表 | ≤100,000 | QuotationID, QuotationNo |
| 7 | quotation_detail | 报价单明细表 | ≤1,000,000 | DetailID, QuotationID |
| 8 | sales_order | 销售订单表 | ≤100,000 | OrderID, OrderNo |
| 9 | sales_order_detail | 销售订单明细表 | ≤1,000,000 | DetailID, OrderID |
| 10 | purchase_order | 采购订单表 | ≤50,000 | POID, PONo |
| 11 | purchase_order_detail | 采购订单明细表 | ≤500,000 | DetailID, POID |
| 12 | production_plan | 生产计划表 | ≤50,000 | PlanID, PlanNo |
| 13 | recipe | 配方表 | ≤10,000 | RecipeID |
| 14 | material_supplier | 原材料供应商关联表 | ≤50,000 | ID, MaterialID, SupplierID |
| 15 | inventory | 库存表 | ≤100,000 | InventoryID |
| 16 | receivable | 应收款表 | ≤50,000 | ReceivableID |
| 17 | payable | 应付款表 | ≤50,000 | PayableID |
| 18 | expense | 报销表 | ≤100,000 | ExpenseID |
| 19 | message | 站内消息表 | ≤1,000,000 | MessageID |
| 20 | operation_log | 操作日志表 | ≤10,000,000 | LogID |

---

## 三、表结构详细说明

### 1. 用户表 (user)

**说明**: 系统用户信息表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | UserID | INT | - | 否 | AUTO_INCREMENT | 用户ID (主键) |
| 2 | UserName | VARCHAR | 50 | 否 | - | 用户名 (唯一) |
| 3 | Password | VARCHAR | 255 | 否 | - | 密码 (加密存储) |
| 4 | RealName | VARCHAR | 100 | 是 | NULL | 真实姓名 |
| 5 | Role | VARCHAR | 20 | 否 | 'user' | 角色 (admin/user) |
| 6 | Department | VARCHAR | 100 | 是 | NULL | 部门 |
| 7 | Email | VARCHAR | 100 | 是 | NULL | 电子邮箱 |
| 8 | Phone | VARCHAR | 50 | 是 | NULL | 联系电话 |
| 9 | Status | INT | - | 否 | 1 | 状态 (0禁用/1启用) |
| 10 | LastLoginDate | DATETIME | - | 是 | NULL | 最后登录时间 |
| 11 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 12 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: UserID
- UNIQUE KEY: idx_username (UserName)
- KEY: idx_role (Role)
- KEY: idx_user_status (Status)

---

### 2. 客户表 (customer)

**说明**: 客户基本信息表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | CustomerID | INT | - | 否 | AUTO_INCREMENT | 客户ID (主键) |
| 2 | CustomerCode | VARCHAR | 50 | 否 | - | 客户编号 (唯一) |
| 3 | CustomerName | VARCHAR | 200 | 否 | - | 客户名称 |
| 4 | Contact | VARCHAR | 100 | 是 | NULL | 联系人 |
| 5 | Phone | VARCHAR | 50 | 是 | NULL | 联系电话 |
| 6 | Fax | VARCHAR | 50 | 是 | NULL | 传真 |
| 7 | Email | VARCHAR | 100 | 是 | NULL | 电子邮箱 |
| 8 | Address | VARCHAR | 500 | 是 | NULL | 地址 |
| 9 | Status | INT | - | 否 | 1 | 状态 (0禁用/1启用) |
| 10 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 11 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: CustomerID
- UNIQUE KEY: idx_code (CustomerCode)
- KEY: idx_name (CustomerName)
- KEY: idx_customer_status (Status)

---

### 3. 供应商表 (supplier)

**说明**: 供应商基本信息表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | SupplierID | INT | - | 否 | AUTO_INCREMENT | 供应商ID (主键) |
| 2 | SupplierCode | VARCHAR | 50 | 否 | - | 供应商编号 (唯一) |
| 3 | SupplierName | VARCHAR | 200 | 否 | - | 供应商名称 |
| 4 | Contact | VARCHAR | 100 | 是 | NULL | 联系人 |
| 5 | Phone | VARCHAR | 50 | 是 | NULL | 联系电话 |
| 6 | Fax | VARCHAR | 50 | 是 | NULL | 传真 |
| 7 | Email | VARCHAR | 100 | 是 | NULL | 电子邮箱 |
| 8 | Address | VARCHAR | 500 | 是 | NULL | 地址 |
| 9 | Status | INT | - | 否 | 1 | 状态 (0禁用/1启用) |
| 10 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 11 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: SupplierID
- UNIQUE KEY: idx_code (SupplierCode)
- KEY: idx_name (SupplierName)
- KEY: idx_supplier_status (Status)

---

### 4. 产品表 (product)

**说明**: 产品基本信息表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | ProductID | INT | - | 否 | AUTO_INCREMENT | 产品ID (主键) |
| 2 | ProductCode | VARCHAR | 50 | 否 | - | 产品编号 (唯一) |
| 3 | ProductName | VARCHAR | 200 | 否 | - | 产品名称 |
| 4 | Category | VARCHAR | 50 | 是 | NULL | 产品类别 |
| 5 | Unit | VARCHAR | 20 | 是 | NULL | 单位 |
| 6 | Spec | VARCHAR | 200 | 是 | NULL | 规格 |
| 7 | Price | DECIMAL | 12,2 | 否 | 0.00 | 销售单价 |
| 8 | Cost | DECIMAL | 12,2 | 否 | 0.00 | 成本单价 |
| 9 | Status | INT | - | 否 | 1 | 状态 (0禁用/1启用) |
| 10 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 11 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: ProductID
- UNIQUE KEY: idx_code (ProductCode)
- KEY: idx_name (ProductName)
- KEY: idx_category (Category)
- KEY: idx_product_status (Status)

---

### 5. 仓库表 (warehouse)

**说明**: 仓库信息表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | WarehouseID | INT | - | 否 | AUTO_INCREMENT | 仓库ID (主键) |
| 2 | WarehouseCode | VARCHAR | 50 | 否 | - | 仓库编号 (唯一) |
| 3 | WarehouseName | VARCHAR | 100 | 否 | - | 仓库名称 |
| 4 | Type | VARCHAR | 50 | 否 | - | 仓库类型 (车间仓/成品仓/材料仓/外仓/待处理仓) |
| 5 | Location | VARCHAR | 200 | 是 | NULL | 仓库位置 |
| 6 | Manager | VARCHAR | 100 | 是 | NULL | 仓库管理员 |
| 7 | Status | INT | - | 否 | 1 | 状态 (0禁用/1启用) |
| 8 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |

**索引**:
- PRIMARY KEY: WarehouseID
- UNIQUE KEY: idx_code (WarehouseCode)
- KEY: idx_type (Type)
- KEY: idx_warehouse_status (Status)

**预设数据**:
| WarehouseCode | WarehouseName | Type |
|---------------|--------------|------|
| KCA | 车间仓 | 车间仓 |
| KCB | 成品仓 | 成品仓 |
| KCC | 材料仓 | 材料仓 |
| KCD | 外仓 | 外仓 |
| KCE | 待处理仓 | 待处理仓 |

---

### 6. 报价单表 (quotation)

**说明**: 客户报价单主表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | QuotationID | INT | - | 否 | AUTO_INCREMENT | 报价ID (主键) |
| 2 | QuotationNo | VARCHAR | 50 | 否 | - | 报价单号 (唯一) |
| 3 | CustomerID | INT | - | 否 | - | 客户ID (外键) |
| 4 | QuotationDate | DATETIME | - | 否 | - | 报价日期 |
| 5 | ValidUntil | DATETIME | - | 是 | NULL | 有效期至 |
| 6 | TotalAmount | DECIMAL | 12,2 | 否 | 0.00 | 报价总额 |
| 7 | Status | VARCHAR | 20 | 否 | 'pending' | 状态 (pending待确认/accepted已接受/rejected已拒绝) |
| 8 | Creator | VARCHAR | 50 | 是 | NULL | 制单人 |
| 9 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 10 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: QuotationID
- UNIQUE KEY: idx_no (QuotationNo)
- KEY: idx_customer (CustomerID)
- KEY: idx_date (QuotationDate)
- KEY: idx_status (Status)

---

### 7. 报价单明细表 (quotation_detail)

**说明**: 报价单产品明细表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | DetailID | INT | - | 否 | AUTO_INCREMENT | 明细ID (主键) |
| 2 | QuotationID | INT | - | 否 | - | 报价单ID (外键) |
| 3 | ProductID | INT | - | 否 | - | 产品ID (外键) |
| 4 | Quantity | DECIMAL | 12,2 | 否 | 0.00 | 数量 |
| 5 | UnitPrice | DECIMAL | 12,2 | 否 | 0.00 | 单价 |
| 6 | Amount | DECIMAL | 12,2 | 否 | 0.00 | 金额 |

**索引**:
- PRIMARY KEY: DetailID
- KEY: idx_quotation (QuotationID)
- KEY: idx_product (ProductID)

---

### 8. 销售订单表 (sales_order)

**说明**: 销售订单主表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | OrderID | INT | - | 否 | AUTO_INCREMENT | 订单ID (主键) |
| 2 | OrderNo | VARCHAR | 50 | 否 | - | 订单编号 (唯一) |
| 3 | CustomerID | INT | - | 否 | - | 客户ID (外键) |
| 4 | OrderDate | DATETIME | - | 否 | - | 订单日期 |
| 5 | DeliveryDate | DATETIME | - | 是 | NULL | 交货日期 |
| 6 | TotalAmount | DECIMAL | 12,2 | 否 | 0.00 | 订单总额 |
| 7 | Status | VARCHAR | 20 | 否 | 'pending' | 状态 (pending已下单/producing生产中/shipped已发货/completed已完成) |
| 8 | Creator | VARCHAR | 50 | 是 | NULL | 制单人 |
| 9 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 10 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: OrderID
- UNIQUE KEY: idx_no (OrderNo)
- KEY: idx_customer (CustomerID)
- KEY: idx_date (OrderDate)
- KEY: idx_status (Status)

---

### 9. 销售订单明细表 (sales_order_detail)

**说明**: 销售订单产品明细表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | DetailID | INT | - | 否 | AUTO_INCREMENT | 明细ID (主键) |
| 2 | OrderID | INT | - | 否 | - | 订单ID (外键) |
| 3 | ProductID | INT | - | 否 | - | 产品ID (外键) |
| 4 | Quantity | DECIMAL | 12,2 | 否 | 0.00 | 数量 |
| 5 | UnitPrice | DECIMAL | 12,2 | 否 | 0.00 | 单价 |
| 6 | Amount | DECIMAL | 12,2 | 否 | 0.00 | 金额 |

**索引**:
- PRIMARY KEY: DetailID
- KEY: idx_order (OrderID)
- KEY: idx_product (ProductID)

---

### 10. 采购订单表 (purchase_order)

**说明**: 采购订单主表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | POID | INT | - | 否 | AUTO_INCREMENT | 采购单ID (主键) |
| 2 | PONo | VARCHAR | 50 | 否 | - | 采购单编号 (唯一) |
| 3 | SupplierID | INT | - | 否 | - | 供应商ID (外键) |
| 4 | OrderDate | DATETIME | - | 否 | - | 采购日期 |
| 5 | DeliveryDate | DATETIME | - | 是 | NULL | 交货日期 |
| 6 | TotalAmount | DECIMAL | 12,2 | 否 | 0.00 | 采购总额 |
| 7 | Status | VARCHAR | 20 | 否 | 'pending' | 状态 (pending已下单/received已收货/completed已完成) |
| 8 | Creator | VARCHAR | 50 | 是 | NULL | 制单人 |
| 9 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 10 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: POID
- UNIQUE KEY: idx_no (PONo)
- KEY: idx_supplier (SupplierID)
- KEY: idx_date (OrderDate)
- KEY: idx_status (Status)

---

### 11. 采购订单明细表 (purchase_order_detail)

**说明**: 采购订单产品明细表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | DetailID | INT | - | 否 | AUTO_INCREMENT | 明细ID (主键) |
| 2 | POID | INT | - | 否 | - | 采购单ID (外键) |
| 3 | ProductID | INT | - | 否 | - | 产品ID (外键) |
| 4 | Quantity | DECIMAL | 12,2 | 否 | 0.00 | 数量 |
| 5 | UnitPrice | DECIMAL | 12,2 | 否 | 0.00 | 单价 |
| 6 | Amount | DECIMAL | 12,2 | 否 | 0.00 | 金额 |

**索引**:
- PRIMARY KEY: DetailID
- KEY: idx_po (POID)
- KEY: idx_product (ProductID)

---

### 12. 生产计划表 (production_plan)

**说明**: 生产计划主表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | PlanID | INT | - | 否 | AUTO_INCREMENT | 计划ID (主键) |
| 2 | PlanNo | VARCHAR | 50 | 否 | - | 计划编号 (唯一) |
| 3 | ProductID | INT | - | 否 | - | 产品ID (外键) |
| 4 | Quantity | INT | - | 否 | 0 | 计划数量 |
| 5 | StartDate | DATETIME | - | 是 | NULL | 开始日期 |
| 6 | EndDate | DATETIME | - | 是 | NULL | 结束日期 |
| 7 | Status | VARCHAR | 20 | 否 | 'pending' | 状态 (pending待生产/producing生产中/completed已完成) |
| 8 | Creator | VARCHAR | 50 | 是 | NULL | 制单人 |
| 9 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 10 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: PlanID
- UNIQUE KEY: idx_no (PlanNo)
- KEY: idx_product (ProductID)
- KEY: idx_date (StartDate)
- KEY: idx_status (Status)

---

### 13. 配方表 (recipe)

**说明**: 产品配方表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | RecipeID | INT | - | 否 | AUTO_INCREMENT | 配方ID (主键) |
| 2 | ProductID | INT | - | 否 | - | 产品ID (外键) |
| 3 | RecipeName | VARCHAR | 200 | 否 | - | 配方名称 |
| 4 | Materials | TEXT | - | 是 | NULL | 材料清单 (JSON格式) |
| 5 | Ratios | VARCHAR | 500 | 是 | NULL | 材料配比 |
| 6 | Status | INT | - | 否 | 1 | 状态 (0禁用/1启用) |
| 7 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 8 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: RecipeID
- KEY: idx_product (ProductID)

---

### 14. 原材料供应商关联表 (material_supplier)

**说明**: 原材料与供应商的多对多关联表，记录每个供应商提供的原材料信息

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | ID | INT | - | 否 | AUTO_INCREMENT | 关联ID (主键) |
| 2 | MaterialID | INT | - | 否 | - | 原材料ID (外键) |
| 3 | SupplierID | INT | - | 否 | - | 供应商ID (外键) |
| 4 | SupplierProductCode | VARCHAR | 50 | 是 | NULL | 供应商产品代码 |
| 5 | SupplierProductName | VARCHAR | 200 | 是 | NULL | 供应商产品名称 |
| 6 | PurchasePrice | DECIMAL | 12,2 | 否 | 0.00 | 采购价 |
| 7 | Status | INT | - | 否 | 1 | 状态 (0禁用/1启用) |
| 8 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 9 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: ID
- UNIQUE KEY: idx_materialsupplier (MaterialID, SupplierID)
- KEY: idx_material (MaterialID)
- KEY: idx_supplier (SupplierID)

---

### 15. 库存表 (inventory)

**说明**: 各仓库产品库存表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | InventoryID | INT | - | 否 | AUTO_INCREMENT | 库存ID (主键) |
| 2 | WarehouseID | INT | - | 否 | - | 仓库ID (外键) |
| 3 | ProductID | INT | - | 否 | - | 产品ID (外键) |
| 4 | Quantity | DECIMAL | 12,2 | 否 | 0.00 | 库存数量 |
| 5 | UnitCost | DECIMAL | 12,2 | 否 | 0.00 | 单位成本 |
| 6 | Location | VARCHAR | 100 | 是 | NULL | 库位 |
| 7 | UpdateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- PRIMARY KEY: InventoryID
- UNIQUE KEY: idx_warehouseproduct (WarehouseID, ProductID)
- KEY: idx_product (ProductID)
- KEY: idx_inventory_warehouse (WarehouseID)
- KEY: idx_inventory_product (ProductID)

---

### 16. 应收款表 (receivable)

**说明**: 客户应收款表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | ReceivableID | INT | - | 否 | AUTO_INCREMENT | 应收ID (主键) |
| 2 | CustomerID | INT | - | 否 | - | 客户ID (外键) |
| 3 | SalesOrderID | INT | - | 是 | NULL | 关联销售订单 |
| 4 | Amount | DECIMAL | 12,2 | 否 | 0.00 | 应收金额 |
| 5 | ReceivedAmount | DECIMAL | 12,2 | 否 | 0.00 | 已收金额 |
| 6 | DueDate | DATETIME | - | 是 | NULL | 到期日期 |
| 7 | Status | VARCHAR | 20 | 否 | 'unpaid' | 状态 (unpaid未付款/partial部分付款/paid已付清) |
| 8 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 9 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: ReceivableID
- KEY: idx_customer (CustomerID)
- KEY: idx_order (SalesOrderID)
- KEY: idx_status (Status)
- KEY: idx_receivable_status (Status)

---

### 17. 应付款表 (payable)

**说明**: 供应商应付款表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | PayableID | INT | - | 否 | AUTO_INCREMENT | 应付ID (主键) |
| 2 | SupplierID | INT | - | 否 | - | 供应商ID (外键) |
| 3 | PurchaseOrderID | INT | - | 是 | NULL | 关联采购订单 |
| 4 | Amount | DECIMAL | 12,2 | 否 | 0.00 | 应付金额 |
| 5 | PaidAmount | DECIMAL | 12,2 | 否 | 0.00 | 已付金额 |
| 6 | DueDate | DATETIME | - | 是 | NULL | 到期日期 |
| 7 | Status | VARCHAR | 20 | 否 | 'unpaid' | 状态 (unpaid未付款/partial部分付款/paid已付清) |
| 8 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 9 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: PayableID
- KEY: idx_supplier (SupplierID)
- KEY: idx_order (PurchaseOrderID)
- KEY: idx_status (Status)
- KEY: idx_payable_status (Status)

---

### 18. 报销表 (expense)

**说明**: 员工报销表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | ExpenseID | INT | - | 否 | AUTO_INCREMENT | 报销ID (主键) |
| 2 | EmployeeID | INT | - | 否 | - | 员工ID (外键) |
| 3 | ExpenseType | VARCHAR | 50 | 否 | - | 费用类型 |
| 4 | Amount | DECIMAL | 12,2 | 否 | 0.00 | 报销金额 |
| 5 | Description | TEXT | - | 是 | NULL | 费用说明 |
| 6 | Receipts | VARCHAR | 500 | 是 | NULL | 收据附件 |
| 7 | Status | VARCHAR | 20 | 否 | 'pending' | 状态 (pending待审批/approved已批准/rejected已拒绝/paid已报销) |
| 8 | Approver | VARCHAR | 50 | 是 | NULL | 审批人 |
| 9 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| 10 | UpdateDate | DATETIME | - | 是 | NULL | 更新时间 |

**索引**:
- PRIMARY KEY: ExpenseID
- KEY: idx_employee (EmployeeID)
- KEY: idx_type (ExpenseType)
- KEY: idx_status (Status)
- KEY: idx_expense_status (Status)

---

### 19. 站内消息表 (message)

**说明**: 用户间消息表

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | MessageID | INT | - | 否 | AUTO_INCREMENT | 消息ID (主键) |
| 2 | FromUserID | INT | - | 否 | - | 发送者ID (外键) |
| 3 | ToUserID | INT | - | 否 | - | 接收者ID (外键) |
| 4 | Title | VARCHAR | 200 | 是 | NULL | 消息标题 |
| 5 | Content | TEXT | - | 否 | - | 消息内容 |
| 6 | IsRead | INT | - | 否 | 0 | 已读状态 (0未读/1已读) |
| 7 | ReadDate | DATETIME | - | 是 | NULL | 阅读时间 |
| 8 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 发送时间 |

**索引**:
- PRIMARY KEY: MessageID
- KEY: idx_from (FromUserID)
- KEY: idx_to (ToUserID)
- KEY: idx_read (IsRead)

---

### 20. 操作日志表 (operation_log)

**说明**: 系统操作审计日志

| 序号 | 字段名 | 数据类型 | 长度 | 允许NULL | 默认值 | 说明 |
|------|--------|----------|------|---------|--------|------|
| 1 | LogID | INT | - | 否 | AUTO_INCREMENT | 日志ID (主键) |
| 2 | UserID | INT | - | 是 | NULL | 操作用户ID (外键) |
| 3 | Action | VARCHAR | 100 | 否 | - | 操作类型 |
| 4 | Module | VARCHAR | 50 | 是 | NULL | 模块名称 |
| 5 | Description | VARCHAR | 500 | 是 | NULL | 操作描述 |
| 6 | IPAddress | VARCHAR | 50 | 是 | NULL | IP地址 |
| 7 | CreateDate | DATETIME | - | 否 | CURRENT_TIMESTAMP | 操作时间 |

**索引**:
- PRIMARY KEY: LogID
- KEY: idx_user (UserID)
- KEY: idx_action (Action)
- KEY: idx_date (CreateDate)

---

## 四、字段类型说明

### 4.1 数值类型

| 类型 | 说明 | 示例 |
|------|------|------|
| INT | 整数类型 | 1, 100, 1000 |
| DECIMAL(12,2) | 精确数值，12位总长，2位小数 | 100.50, 9999999999.99 |

### 4.2 字符串类型

| 类型 | 说明 | 最大长度 |
|------|------|---------|
| VARCHAR(n) | 可变长度字符串 | n个字符 |
| TEXT | 长文本 | 65,535字节 |

### 4.3 日期时间类型

| 类型 | 说明 | 格式 |
|------|------|------|
| DATETIME | 日期时间 | YYYY-MM-DD HH:MM:SS |
| TIMESTAMP | 时间戳 | 自动记录更新时间 |

### 4.4 状态字段说明

| 状态类型 | 状态值 | 说明 |
|---------|--------|------|
| 用户状态 | 0 | 禁用 |
| | 1 | 启用 |
| 客户/供应商/产品状态 | 0 | 禁用 |
| | 1 | 启用 |
| 报价单状态 | pending | 待确认 |
| | accepted | 已接受 |
| | rejected | 已拒绝 |
| 销售订单状态 | pending | 已下单 |
| | producing | 生产中 |
| | shipped | 已发货 |
| | completed | 已完成 |
| 采购订单状态 | pending | 已下单 |
| | received | 已收货 |
| | completed | 已完成 |
| 生产计划状态 | pending | 待生产 |
| | producing | 生产中 |
| | completed | 已完成 |
| 应收/应付款状态 | unpaid | 未付款 |
| | partial | 部分付款 |
| | paid | 已付清 |
| 报销状态 | pending | 待审批 |
| | approved | 已批准 |
| | rejected | 已拒绝 |
| | paid | 已报销 |
| 消息已读状态 | 0 | 未读 |
| | 1 | 已读 |

---

## 五、索引说明

### 5.1 索引命名规范

- **主键索引**: 自动命名
- **唯一索引**: `idx_` + 字段名
- **普通索引**: `idx_` + 字段名

### 5.2 索引设计原则

1. **主键索引**: 所有表都有自增主键作为聚集索引
2. **唯一索引**: 业务编码字段（如UserID、OrderNo等）建立唯一索引
3. **外键索引**: 所有关联字段建立索引，提高JOIN查询效率
4. **状态索引**: 常用状态字段建立索引，提高过滤效率
5. **日期索引**: 时间字段建立索引，提高范围查询效率

---

## 附录

### A. 数据库初始化脚本位置

- `/workspace/erp-backend/src/main/resources/db/init.sql` - 完整初始化脚本
- `/workspace/erp-backend/src/main/resources/db/schema.sql` - 基础表结构
- `/workspace/erp-backend/src/main/resources/db/data.sql` - 初始数据

### B. 后端实体类位置

- `/workspace/erp-backend/src/main/java/com/erp/entity/`

### C. 前端API定义位置

- `/workspace/erp-frontend/src/api/`

### D. 数据字典版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0 | 2026-05-20 | 初始版本，基于原ASP系统分析生成 |

---

**文档结束**
