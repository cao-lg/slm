# ERP企业资源管理系统 - 需求规格说明书

## 版本历史

| 版本号 | 日期 | 作者 | 说明 |
|--------|------|------|------|
| 1.0 | 2026-05-20 | AI Assistant | 初始版本，基于登录页面分析 |
| 2.0 | 2026-05-20 | AI Assistant | 更新版本，添加实际系统探索发现 |
| 3.0 | 2026-05-20 | AI Assistant | 重大更新，清理混杂内容，对齐ERP功能模块 |

---

## 1. 背景与目标

### 1.1 项目背景

现有系统 `http://test.qg827.com/` 是一套基于ASP技术构建的**ERP企业资源管理系统**，采用B/S架构，运行于Windows Server + IIS环境，后端使用Microsoft Access或SQL Server数据库。该系统经过多年运行，积累了丰富的业务功能和用户数据。

**✓ 已完成**：通过Playwright自动化工具成功登录系统，获取了完整的功能模块信息。

### 1.2 实际探索发现的系统架构

#### 1.2.1 登录信息

- **URL**: http://test.qg827.com/
- **账号**: CLG
- **密码**: 258258258
- **登录后URL**: http://test.qg827.com/system/adminSMS.asp?dh=0
- **编码**: GB2312
- **HTML版本**: XHTML 1.0 Strict

#### 1.2.2 登录表单结构

```html
<form name="Login" action="Admin_ChkLogin.asp" method="post" onsubmit="return CheckForm();">
  <input name="UserName" type="text" maxlength="20">
  <input name="password" type="password" maxlength="20">
  <input type="submit" value="登录">
</form>
```

### 1.3 项目目标

将现有ERP系统转换为现代化技术栈，同时保留所有原有功能，并扩展教学实训功能，使其成为：
- ERP企业资源管理系统的现代化升级版本
- 高校企业管理、信息管理、物流管理等专业的教学实训平台
- 理论与实践相结合的教学工具

### 1.4 技术转型要求

| 原技术栈 | 目标技术栈 |
|----------|------------|
| ASP 3.0 + VBScript | Vue 3 + Spring Boot / NestJS |
| Access/SQL Server | MySQL 8.0+ / PostgreSQL |
| IIS | Docker + Kubernetes |
| Session状态管理 | JWT + Redis |
| 静态HTML | Vue 3 + TypeScript |
| 内联VBScript | RESTful API |

---

## 2. 系统功能模块规格

### 2.1 功能模块总览

基于实际探索的ERP系统，包含以下**7个核心模块**，共**24个功能页面**：

```
┌─────────────────────────────────────────────────────────────────┐
│ ERP企业资源管理系统主菜单                                         │
├─────────────────────────────────────────────────────────────────┤
│ 销售管理 (dh=1)           → 5个功能页面                          │
│ 采购管理 (dh=2)           → 3个功能页面                          │
│ 生产管理 (dh=3)           → 3个功能页面                          │
│ 仓库管理 (dh=4)           → 9个功能页面                          │
│ 产品管理 (dh=6)           → 1个功能页面                          │
│ 财务管理 (dh=8)           → 3个功能页面                          │
│ 系统管理 (dh=0)           → 4个功能页面                          │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 销售管理模块 (dh=1)

| 功能页面 | ASP文件 | URL参数 | 功能说明 |
|----------|---------|---------|----------|
| 报价单 | ProksBJ.asp | dh=1 | 客户询价管理，生成报价单据 |
| 销售订单 | HTPI.asp | dh=1 | 销售订单管理，记录客户订单 |
| 产品汇总 | HTPIcp.asp | dh=1 | 销售产品汇总统计 |
| 订单统计 | HTPIFXcp.asp | dh=1 | 订单数据分析统计 |
| 客户管理 | PIKH.asp | dh=1 | 客户信息维护管理 |

**业务流程**：
```
报价单 → 销售订单 → 发货 → 收款
```

**核心字段**：
- 报价单：报价单号、客户名称、产品明细、报价金额、有效期
- 销售订单：订单号、客户、产品、数量、单价、金额、交货日期
- 客户管理：客户编号、客户名称、联系人、电话、地址

### 2.3 采购管理模块 (dh=2)

| 功能页面 | ASP文件 | URL参数 | 功能说明 |
|----------|---------|---------|----------|
| 采购订单 | CG.asp | dh=2 | 采购订单管理 |
| 原材料 | Products.asp | dh=2&list=3&supID=0 | 原材料产品管理 |
| 供应商管理 | SUP.asp | dh=2 | 供应商信息维护 |

**业务流程**：
```
询价 → 采购订单 → 收货 → 付款
```

**核心字段**：
- 采购订单：采购单号、供应商、产品、数量、单价、金额、交货日期
- 原材料：产品编号、产品名称、规格、单位、单价
- 供应商：供应商编号、名称、联系人、电话、地址

### 2.4 生产管理模块 (dh=3)

| 功能页面 | ASP文件 | URL参数 | 功能说明 |
|----------|---------|---------|----------|
| 生产计划 | SC.asp | dh=3 | 生产计划制定与执行 |
| 配方单 | SCcp.asp | dh=3 | 产品配方管理 |
| 生产统计 | SCFX.asp | dh=3 | 生产数据统计分析 |

**业务流程**：
```
生产计划 → 配方单 → 领料 → 生产 → 入库
```

**核心字段**：
- 生产计划：计划编号、产品、数量、开始日期、完成日期、状态
- 配方单：配方编号、产品、材料明细、配比、用量

### 2.5 仓库管理模块 (dh=4)

| 功能页面 | ASP文件 | URL参数 | 功能说明 |
|----------|---------|---------|----------|
| 车间仓 | KCA.asp | dh=4 | 车间仓库管理 |
| 发货单 | KCFH.asp | dh=4 | 销售发货单据 |
| 成品仓 | KCB.asp | dh=4 | 成品仓库管理 |
| 调拨单 | KCTP.asp | dh=4 | 仓库间调拨 |
| 材料仓 | KCC.asp | dh=4 | 原材料仓库 |
| 领料单 | LD.asp | dh=4 | 生产领料单据 |
| 外仓 | KCD.asp | ck=50&dh=4 | 外协仓库管理 |
| 待处理仓 | KCE.asp | dh=4 | 待处理仓库 |
| 退货单 | - | dh=4 | 退货处理单据 |

**业务流程**：
```
领料(车间仓) → 生产 → 入库(成品仓)
销售发货(成品仓 → 发货单)
采购收货(材料仓)
退货处理(待处理仓 → 退货单)
```

**核心字段**：
- 仓库单据：单据编号、仓库、产品、数量、操作日期、经手人
- 库存管理：仓库、产品、库存数量、库位

### 2.6 产品管理模块 (dh=6)

| 功能页面 | ASP文件 | URL参数 | 功能说明 |
|----------|---------|---------|----------|
| 产品列表 | Products.asp | dh=6 | 产品目录管理 |

**核心字段**：
- 产品编号、产品名称、类别、规格、单位、单价、成本价、状态

### 2.7 财务管理模块 (dh=8)

| 功能页面 | ASP文件 | URL参数 | 功能说明 |
|----------|---------|---------|----------|
| 应收管理 | OAS.asp | dh=8 | 应收账款管理 |
| 应付管理 | OAF.asp | dh=8 | 应付账款管理 |
| 报销管理 | baoxiao.asp | dh=8 | 费用报销管理 |

**业务流程**：
```
销售收款(应收管理)
采购付款(应付管理)
费用报销(报销管理)
```

**核心字段**：
- 应收管理：应收单号、客户、金额、已收金额、到期日期、状态
- 应付管理：应付单号、供应商、金额、已付金额、到期日期、状态
- 报销管理：报销单号、申请人、费用类型、金额、审批状态

### 2.8 系统管理模块 (dh=0)

| 功能页面 | ASP文件 | URL参数 | 功能说明 |
|----------|---------|---------|----------|
| 站内通知 | adminSMS.asp | dh=0 | 系统通知公告 |
| 界面管理 | face.asp | dh=0 | 界面样式管理 |
| 用户列表 | Admin_AdminList.asp | dh=0 | 系统用户管理 |
| 修改密码 | Admin_AdminModifyPwd.asp | dh=0 | 密码修改 |

---

## 3. 数据模型规格

### 3.1 核心业务数据表（共16张）

#### 3.1.1 客户表 (Customer)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| CustomerID | INT | - | NO | AUTO_INCREMENT | 客户ID，主键 |
| CustomerCode | VARCHAR | 50 | NO | - | 客户编号 |
| CustomerName | VARCHAR | 200 | NO | - | 客户名称 |
| Contact | VARCHAR | 100 | YES | - | 联系人 |
| Phone | VARCHAR | 50 | YES | - | 联系电话 |
| Fax | VARCHAR | 50 | YES | - | 传真 |
| Email | VARCHAR | 100 | YES | - | 电子邮箱 |
| Address | VARCHAR | 500 | YES | - | 地址 |
| Status | INT | - | NO | 1 | 状态：0禁用，1启用 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| UpdateDate | DATETIME | - | YES | - | 更新时间 |

**索引：**
- PRIMARY KEY (CustomerID)
- UNIQUE INDEX idx_code (CustomerCode)
- INDEX idx_name (CustomerName)

#### 3.1.2 供应商表 (Supplier)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| SupplierID | INT | - | NO | AUTO_INCREMENT | 供应商ID，主键 |
| SupplierCode | VARCHAR | 50 | NO | - | 供应商编号 |
| SupplierName | VARCHAR | 200 | NO | - | 供应商名称 |
| Contact | VARCHAR | 100 | YES | - | 联系人 |
| Phone | VARCHAR | 50 | YES | - | 联系电话 |
| Fax | VARCHAR | 50 | YES | - | 传真 |
| Email | VARCHAR | 100 | YES | - | 电子邮箱 |
| Address | VARCHAR | 500 | YES | - | 地址 |
| Status | INT | - | NO | 1 | 状态：0禁用，1启用 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| UpdateDate | DATETIME | - | YES | - | 更新时间 |

**索引：**
- PRIMARY KEY (SupplierID)
- UNIQUE INDEX idx_code (SupplierCode)
- INDEX idx_name (SupplierName)

#### 3.1.3 产品表 (Product)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| ProductID | INT | - | NO | AUTO_INCREMENT | 产品ID，主键 |
| ProductCode | VARCHAR | 50 | NO | - | 产品编号 |
| ProductName | VARCHAR | 200 | NO | - | 产品名称 |
| Category | VARCHAR | 50 | YES | - | 产品类别 |
| Unit | VARCHAR | 20 | YES | - | 单位 |
| Spec | VARCHAR | 200 | YES | - | 规格 |
| Price | DECIMAL | 12,2 | YES | 0 | 销售单价 |
| Cost | DECIMAL | 12,2 | YES | 0 | 成本单价 |
| Status | INT | - | NO | 1 | 状态：0禁用，1启用 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| UpdateDate | DATETIME | - | YES | - | 更新时间 |

**索引：**
- PRIMARY KEY (ProductID)
- UNIQUE INDEX idx_code (ProductCode)
- INDEX idx_name (ProductName)
- INDEX idx_category (Category)

#### 3.1.4 仓库表 (Warehouse)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| WarehouseID | INT | - | NO | AUTO_INCREMENT | 仓库ID，主键 |
| WarehouseCode | VARCHAR | 50 | NO | - | 仓库编号 |
| WarehouseName | VARCHAR | 100 | NO | - | 仓库名称 |
| Type | VARCHAR | 50 | NO | - | 仓库类型：车间仓/成品仓/材料仓/外仓/待处理仓 |
| Location | VARCHAR | 200 | YES | - | 仓库位置 |
| Manager | VARCHAR | 100 | YES | - | 仓库管理员 |
| Status | INT | - | NO | 1 | 状态：0禁用，1启用 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (WarehouseID)
- UNIQUE INDEX idx_code (WarehouseCode)
- INDEX idx_type (Type)

#### 3.1.5 销售订单表 (SalesOrder)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| OrderID | INT | - | NO | AUTO_INCREMENT | 订单ID，主键 |
| OrderNo | VARCHAR | 50 | NO | - | 订单编号 |
| CustomerID | INT | - | NO | - | 客户ID |
| OrderDate | DATETIME | - | NO | - | 订单日期 |
| DeliveryDate | DATETIME | - | YES | - | 交货日期 |
| TotalAmount | DECIMAL | 12,2 | NO | 0 | 订单总额 |
| Status | VARCHAR | 20 | NO | 'pending' | 状态：pending已下单/producing生产中/shipped已发货/completed已完成 |
| Creator | VARCHAR | 50 | YES | - | 制单人 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| UpdateDate | DATETIME | - | YES | - | 更新时间 |

**索引：**
- PRIMARY KEY (OrderID)
- UNIQUE INDEX idx_no (OrderNo)
- INDEX idx_customer (CustomerID)
- INDEX idx_date (OrderDate)
- INDEX idx_status (Status)

#### 3.1.6 销售订单明细表 (SalesOrderDetail)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| DetailID | INT | - | NO | AUTO_INCREMENT | 明细ID，主键 |
| OrderID | INT | - | NO | - | 订单ID，外键 |
| ProductID | INT | - | NO | - | 产品ID |
| Quantity | DECIMAL | 12,2 | NO | 0 | 数量 |
| UnitPrice | DECIMAL | 12,2 | NO | 0 | 单价 |
| Amount | DECIMAL | 12,2 | NO | 0 | 金额 |

**索引：**
- PRIMARY KEY (DetailID)
- INDEX idx_order (OrderID)
- INDEX idx_product (ProductID)

#### 3.1.7 报价单表 (Quotation)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| QuotationID | INT | - | NO | AUTO_INCREMENT | 报价ID，主键 |
| QuotationNo | VARCHAR | 50 | NO | - | 报价单号 |
| CustomerID | INT | - | NO | - | 客户ID |
| QuotationDate | DATETIME | - | NO | - | 报价日期 |
| ValidUntil | DATETIME | - | YES | - | 有效期至 |
| TotalAmount | DECIMAL | 12,2 | NO | 0 | 报价总额 |
| Status | VARCHAR | 20 | NO | 'pending' | 状态：pending待确认/accepted已接受/rejected已拒绝 |
| Creator | VARCHAR | 50 | YES | - | 制单人 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (QuotationID)
- UNIQUE INDEX idx_no (QuotationNo)
- INDEX idx_customer (CustomerID)

#### 3.1.8 采购订单表 (PurchaseOrder)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| POID | INT | - | NO | AUTO_INCREMENT | 采购单ID，主键 |
| PONo | VARCHAR | 50 | NO | - | 采购单编号 |
| SupplierID | INT | - | NO | - | 供应商ID |
| OrderDate | DATETIME | - | NO | - | 采购日期 |
| DeliveryDate | DATETIME | - | YES | - | 交货日期 |
| TotalAmount | DECIMAL | 12,2 | NO | 0 | 采购总额 |
| Status | VARCHAR | 20 | NO | 'pending' | 状态：pending已下单/received已收货/completed已完成 |
| Creator | VARCHAR | 50 | YES | - | 制单人 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (POID)
- UNIQUE INDEX idx_no (PONo)
- INDEX idx_supplier (SupplierID)
- INDEX idx_date (OrderDate)

#### 3.1.9 采购订单明细表 (PurchaseOrderDetail)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| DetailID | INT | - | NO | AUTO_INCREMENT | 明细ID，主键 |
| POID | INT | - | NO | - | 采购单ID，外键 |
| ProductID | INT | - | NO | - | 产品ID |
| Quantity | DECIMAL | 12,2 | NO | 0 | 数量 |
| UnitPrice | DECIMAL | 12,2 | NO | 0 | 单价 |
| Amount | DECIMAL | 12,2 | NO | 0 | 金额 |

**索引：**
- PRIMARY KEY (DetailID)
- INDEX idx_po (POID)
- INDEX idx_product (ProductID)

#### 3.1.10 生产计划表 (ProductionPlan)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| PlanID | INT | - | NO | AUTO_INCREMENT | 计划ID，主键 |
| PlanNo | VARCHAR | 50 | NO | - | 计划编号 |
| ProductID | INT | - | NO | - | 产品ID |
| Quantity | INT | - | NO | 0 | 计划数量 |
| StartDate | DATETIME | - | YES | - | 开始日期 |
| EndDate | DATETIME | - | YES | - | 结束日期 |
| Status | VARCHAR | 20 | NO | 'pending' | 状态：pending待生产/producing生产中/completed已完成 |
| Creator | VARCHAR | 50 | YES | - | 制单人 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (PlanID)
- UNIQUE INDEX idx_no (PlanNo)
- INDEX idx_product (ProductID)
- INDEX idx_date (StartDate)

#### 3.1.11 配方表 (Recipe)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| RecipeID | INT | - | NO | AUTO_INCREMENT | 配方ID，主键 |
| ProductID | INT | - | NO | - | 产品ID |
| RecipeName | VARCHAR | 200 | NO | - | 配方名称 |
| Materials | TEXT | - | YES | - | 材料清单（JSON格式） |
| Ratios | VARCHAR | 500 | YES | - | 材料配比 |
| Status | INT | - | NO | 1 | 状态：0禁用，1启用 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (RecipeID)
- INDEX idx_product (ProductID)

#### 3.1.12 库存表 (Inventory)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| InventoryID | INT | - | NO | AUTO_INCREMENT | 库存ID，主键 |
| WarehouseID | INT | - | NO | - | 仓库ID |
| ProductID | INT | - | NO | - | 产品ID |
| Quantity | DECIMAL | 12,2 | NO | 0 | 库存数量 |
| UnitCost | DECIMAL | 12,2 | YES | 0 | 单位成本 |
| Location | VARCHAR | 100 | YES | - | 库位 |
| UpdateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY (InventoryID)
- UNIQUE INDEX idx_warehouseproduct (WarehouseID, ProductID)
- INDEX idx_product (ProductID)

#### 3.1.13 应收款表 (Receivable)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| ReceivableID | INT | - | NO | AUTO_INCREMENT | 应收ID，主键 |
| CustomerID | INT | - | NO | - | 客户ID |
| SalesOrderID | INT | - | YES | - | 关联销售订单 |
| Amount | DECIMAL | 12,2 | NO | 0 | 应收金额 |
| ReceivedAmount | DECIMAL | 12,2 | YES | 0 | 已收金额 |
| DueDate | DATETIME | - | YES | - | 到期日期 |
| Status | VARCHAR | 20 | NO | 'unpaid' | 状态：unpaid未付款/partial部分付款/paid已付清 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (ReceivableID)
- INDEX idx_customer (CustomerID)
- INDEX idx_order (SalesOrderID)
- INDEX idx_status (Status)

#### 3.1.14 应付款表 (Payable)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| PayableID | INT | - | NO | AUTO_INCREMENT | 应付ID，主键 |
| SupplierID | INT | - | NO | - | 供应商ID |
| PurchaseOrderID | INT | - | YES | - | 关联采购订单 |
| Amount | DECIMAL | 12,2 | NO | 0 | 应付金额 |
| PaidAmount | DECIMAL | 12,2 | YES | 0 | 已付金额 |
| DueDate | DATETIME | - | YES | - | 到期日期 |
| Status | VARCHAR | 20 | NO | 'unpaid' | 状态：unpaid未付款/partial部分付款/paid已付清 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (PayableID)
- INDEX idx_supplier (SupplierID)
- INDEX idx_order (PurchaseOrderID)

#### 3.1.15 报销表 (Expense)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| ExpenseID | INT | - | NO | AUTO_INCREMENT | 报销ID，主键 |
| EmployeeID | INT | - | NO | - | 员工ID |
| ExpenseType | VARCHAR | 50 | NO | - | 费用类型 |
| Amount | DECIMAL | 12,2 | NO | 0 | 报销金额 |
| Description | TEXT | - | YES | - | 费用说明 |
| Receipts | VARCHAR | 500 | YES | - | 收据附件 |
| Status | VARCHAR | 20 | NO | 'pending' | 状态：pending待审批/approved已批准/rejected已拒绝/paid已报销 |
| Approver | VARCHAR | 50 | YES | - | 审批人 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (ExpenseID)
- INDEX idx_employee (EmployeeID)
- INDEX idx_type (ExpenseType)
- INDEX idx_status (Status)

#### 3.1.16 用户表 (User)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| UserID | INT | - | NO | AUTO_INCREMENT | 用户ID，主键 |
| UserName | VARCHAR | 50 | NO | - | 用户名 |
| Password | VARCHAR | 255 | NO | - | 密码（MD5加密） |
| RealName | VARCHAR | 100 | YES | - | 真实姓名 |
| Role | VARCHAR | 20 | NO | 'user' | 角色：admin管理员/user普通用户 |
| Department | VARCHAR | 100 | YES | - | 部门 |
| Email | VARCHAR | 100 | YES | - | 电子邮箱 |
| Phone | VARCHAR | 50 | YES | - | 联系电话 |
| Status | INT | - | NO | 1 | 状态：0禁用，1启用 |
| LastLoginDate | DATETIME | - | YES | - | 最后登录时间 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (UserID)
- UNIQUE INDEX idx_username (UserName)
- INDEX idx_role (Role)

#### 3.1.17 站内消息表 (Message)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| MessageID | INT | - | NO | AUTO_INCREMENT | 消息ID，主键 |
| FromUserID | INT | - | NO | - | 发送者ID |
| ToUserID | INT | - | NO | - | 接收者ID |
| Title | VARCHAR | 200 | YES | - | 消息标题 |
| Content | TEXT | - | NO | - | 消息内容 |
| IsRead | INT | - | NO | 0 | 已读状态：0未读，1已读 |
| ReadDate | DATETIME | - | YES | - | 阅读时间 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 发送时间 |

**索引：**
- PRIMARY KEY (MessageID)
- INDEX idx_from (FromUserID)
- INDEX idx_to (ToUserID)
- INDEX idx_read (IsRead)

#### 3.1.18 操作日志表 (OperationLog)

| 字段名 | 数据类型 | 长度 | 允许空 | 默认值 | 说明 |
|--------|----------|------|--------|--------|------|
| LogID | INT | - | NO | AUTO_INCREMENT | 日志ID |
| UserID | INT | - | YES | - | 操作用户ID |
| Action | VARCHAR | 100 | NO | - | 操作类型 |
| Module | VARCHAR | 50 | YES | - | 模块名称 |
| Description | VARCHAR | 500 | YES | - | 操作描述 |
| IPAddress | VARCHAR | 50 | YES | - | IP地址 |
| CreateDate | DATETIME | - | NO | CURRENT_TIMESTAMP | 操作时间 |

**索引：**
- PRIMARY KEY (LogID)
- INDEX idx_user (UserID)
- INDEX idx_action (Action)
- INDEX idx_date (CreateDate)

### 3.2 表关系图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Customer   │────▶│ SalesOrder │◀────│  SalesOrder │
│  (客户)     │     │ (销售订单)  │     │   Detail    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                    │
      │                   │                    ▼
      │                   │            ┌─────────────┐
      │                   │            │   Product   │
      │                   │            │  (产品)     │
      │                   ▼            └─────────────┘
      │            ┌─────────────┐
      └───────────▶│ Receivable  │
                   │  (应收款)   │
                   └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Supplier   │────▶│PurchaseOrder│◀────│PurchaseOrder│
│  (供应商)   │     │ (采购订单)  │     │   Detail    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                    │
      │                   │                    ▼
      │                   │            ┌─────────────┐
      │                   │            │   Product   │
      │                   │            │  (产品)     │
      │                   ▼            └─────────────┘
      │            ┌─────────────┐
      └───────────▶│  Payable    │
                   │  (应付款)   │
                   └─────────────┘

┌─────────────┐     ┌─────────────┐
│  Product    │────▶│ProductionPlan│
│  (产品)     │     │ (生产计划)  │
└─────────────┘     └─────────────┘
      │
      ▼
┌─────────────┐     ┌─────────────┐
│   Recipe    │     │ Inventory   │
│  (配方)     │────▶│  (库存)     │
└─────────────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ Warehouse   │
                   │  (仓库)     │
                   └─────────────┘
```

---

## 4. 业务流程规格

### 4.1 用户登录流程

```
┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  打开   │───▶│  输入用户名   │───▶│  输入密码    │───▶│  提交表单   │
│  登录页 │    │              │    │              │    │              │
└─────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘
                                                                 │
                                                                 ▼
┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  登录   │◀───│  验证失败    │    │  验证成功    │───▶│  进入主页    │
│  失败   │    │  提示错误    │    │  创建Session │    │  加载菜单    │
└─────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### 4.2 销售业务流程

```
报价单管理          销售订单管理          发货管理           收款管理
┌──────────┐      ┌──────────┐         ┌──────────┐      ┌──────────┐
│ 询价接待  │ ──▶ │ 签订订单  │ ─────▶ │ 发货出库  │ ───▶ │ 应收款   │
│ 生成报价  │      │ 审核确认  │         │ 填发货单  │       │ 收款核销  │
└──────────┘      └──────────┘         └──────────┘      └──────────┘
      │                │                     │
      │                ▼                     ▼
      │          ┌──────────┐          ┌──────────┐
      └─────────▶│ 转为订单  │          │ 更新库存  │
                 └──────────┘          └──────────┘
```

### 4.3 采购业务流程

```
供应商管理          采购订单管理          收货管理           付款管理
┌──────────┐      ┌──────────┐         ┌──────────┐      ┌──────────┐
│ 供应商档案 │ ──▶ │ 采购申请  │ ─────▶ │ 收货入库  │ ───▶ │ 应付款   │
│ 资质审核   │      │ 订单审批  │         │ 填入库单  │       │ 付款核销  │
└──────────┘      └──────────┘         └──────────┘      └──────────┘
                       │                     │
                       │                     ▼
                       │              ┌──────────┐
                       └─────────────▶ │ 更新库存  │
                                       └──────────┘
```

### 4.4 生产业务流程

```
生产计划管理          配方管理           领料管理           生产入库
┌──────────┐      ┌──────────┐         ┌──────────┐      ┌──────────┐
│ 制定计划  │ ──▶ │ 选择配方  │ ─────▶ │ 领料出库  │ ───▶ │ 成品入库 │
│ 分配任务   │      │ 配比确认  │         │ 审核领料  │       │ 质量检验  │
└──────────┘      └──────────┘         └──────────┘      └──────────┘
      │                                       │
      │                                       ▼
      │                               ┌──────────┐
      └───────────────────────────────▶│ 更新库存 │
                                       └──────────┘
```

### 4.5 仓库管理流程

```
入库管理              出库管理            调拨管理            退货管理
┌──────────┐         ┌──────────┐        ┌──────────┐       ┌──────────┐
│ 采购入库  │ ────▶ │ 销售出库  │        │ 仓库调拨  │       │ 退货处理 │
│ 生产入库  │        │ 领料出库  │        │ 审核调拨  │       │ 检验入库 │
│ 退货入库  │        │ 其他出库  │        └──────────┘       └──────────┘
└──────────┘        └──────────┘             │
      │                   │                  ▼
      │                   │           ┌──────────┐
      └───────────────────┴───────────▶│ 更新库存 │
                                       └──────────┘
```

### 4.6 财务应收应付流程

```
应收管理                    应付管理
┌──────────────┐           ┌──────────────┐
│ 销售订单收款 │           │ 采购订单付款 │
│ 开具发票     │           │ 费用报销付款 │
│ 到期提醒     │           │ 到期付款提醒 │
└──────────────┘           └──────────────┘
```

---

## 5. 界面规格

### 5.1 登录页面

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                           ERP企业管理系统                               │
│                        [系统名称居中]                                  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │    用户名:  [____________________________]                     │   │
│  │                                                                │   │
│  │    密    码:  [____________________________]                   │   │
│  │                                                                │   │
│  │              [            登  录             ]                │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

**关键元素：**
- 用户名输入框：name="UserName", maxlength=20
- 密码输入框：name="password", type="password", maxlength=20
- 提交按钮：type="submit", value="登录"
- 表单提交地址：Admin_ChkLogin.asp

### 5.2 主页面布局

```
┌────────────────────────────────────────────────────────────────────────┐
│  [Logo] ERP企业管理系统    │ 当前位置: 首页 │  欢迎, CLG  │  [退出系统] │
├────────────────┬───────────────────────────────────────────────────────┤
│                │                                                        │
│  销售管理      │                                                        │
│   ├─ 报价单    │                                                        │
│   ├─ 销售订单  │                                                        │
│   ├─ 产品汇总  │                                                        │
│   ├─ 订单统计  │                                                        │
│   └─ 客户管理  │                                                        │
│                │                                                        │
│  采购管理      │                                                        │
│   ├─ 采购订单  │                                                        │
│   ├─ 原材料    │                                                        │
│   └─ 供应商管理│                                                        │
│                │                                                        │
│  生产管理      │                                                        │
│   ├─ 生产计划  │                                                        │
│   ├─ 配方单    │                                                        │
│   └─ 生产统计  │                                                        │
│                │                                                        │
│  仓库管理      │                                                        │
│   ├─ 车间仓    │                                                        │
│   ├─ 发货单    │                                                        │
│   ├─ 成品仓    │                                                        │
│   ├─ 调拨单    │                                                        │
│   ├─ 材料仓    │                                                        │
│   ├─ 领料单    │                                                        │
│   ├─ 外仓      │                                                        │
│   ├─ 待处理仓  │                                                        │
│   └─ 退货单    │                                                        │
│                │                                                        │
│  产品管理      │                                                        │
│   └─ 产品列表  │                                                        │
│                │                                                        │
│  财务管理      │                                                        │
│   ├─ 应收管理  │                                                        │
│   ├─ 应付管理  │                                                        │
│   └─ 报销管理  │                                                        │
│                │                                                        │
│  系统管理      │                                                        │
│   ├─ 站内通知  │                                                        │
│   ├─ 界面管理  │                                                        │
│   ├─ 用户列表  │                                                        │
│   └─ 修改密码  │                                                        │
│                │                                                        │
└────────────────┴───────────────────────────────────────────────────────┘
```

### 5.3 列表页面布局

```
┌────────────────────────────────────────────────────────────────────────┐
│  当前位置: 销售管理 > 销售订单                                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  [新增] [编辑] [删除] [导出]                    [查询条件...] [查询] │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 全选  │ 单号    │ 客户名称  │ 订单日期 │ 金额    │ 状态    │ 操作  │ │
│  ├───────┼─────────┼───────────┼──────────┼─────────┼─────────┼───────┤ │
│  │  □    │ XS2025 │ 客户A    │ 2025-01-│ 10000  │ 已完成  │查看 编辑│ │
│  │  □    │ XS2024 │ 客户B    │ 2025-01-│ 20000  │ 生产中  │查看 编辑│ │
│  │  □    │ XS2023 │ 客户C    │ 2025-01-│ 15000  │ 已发货  │查看 编辑│ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  共 3 条记录   第 1/1 页   首页 上一页 下一页 末页                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.4 表单页面布局

```
┌────────────────────────────────────────────────────────────────────────┐
│  当前位置: 销售管理 > 销售订单 > 新增/编辑                               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  基本信息                                                          │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │  订单编号: [____________]  客户名称: [____▼____]  订单日期: [____] │ │
│  │  交货日期: [____________]  制单人: [____________]                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  产品明细                                                          │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │  ┌──────┬──────────┬───────┬────────┬────────┬────────┐        │ │
│  │  │选择  │ 产品名称  │规格   │ 数量   │ 单价   │ 金额   │ 操作   │ │
│  │  ├──────┼──────────┼───────┼────────┼────────┼────────┤        │ │
│  │  │  □   │ [____▼__] │       │ [____] │ [____] │        │ 添加   │ │
│  │  └──────┴──────────┴───────┴────────┴────────┴────────┘        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  合计金额: [___________]                                          │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│            [保存]  [取消]  [返回列表]                                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. 新增教学实训功能需求

### 6.1 教学实训模块概述

在保留ERP原有功能的基础上，新增教学实训功能，使其成为完整的教学实训平台：

```
┌─────────────────────────────────────────────────────────────────┐
│                    新增教学实训功能                              │
├─────────────────────────────────────────────────────────────────┤
│  1. 实训任务管理                                                 │
│     ├── 实训任务发布                                             │
│     ├── 任务阶段管理                                             │
│     └── 任务模板库                                               │
│                                                                  │
│  2. 实训指导                                                     │
│     ├── 操作手册                                                 │
│     ├── 视频教程                                                 │
│     └── 案例库                                                   │
│                                                                  │
│  3. 实训过程跟踪                                                 │
│     ├── 进度监控                                                 │
│     ├── 操作日志                                                 │
│     └── 屏幕截图                                                 │
│                                                                  │
│  4. 实训评价                                                     │
│     ├── 自评                                                     │
│     ├── 师评                                                     │
│     └── 综合评价                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 实训任务管理

#### 6.2.1 实训任务发布

| 功能 | 规格说明 |
|------|----------|
| 任务名称 | VARCHAR(200)，必填 |
| 所属模块 | 销售/采购/生产/仓库/财务 |
| 任务类型 | ENUM: 'single', 'process', 'simulation' |
| 任务描述 | TEXT，详细描述任务内容 |
| 任务目标 | TEXT，学习目标 |
| 开始时间 | DATETIME |
| 截止时间 | DATETIME |
| 满分分值 | DECIMAL(5,2) |
| 通过分数 | DECIMAL(5,2) |

#### 6.2.2 任务阶段管理

| 字段 | 说明 |
|------|------|
| StageID | 阶段ID |
| TaskID | 任务ID |
| StageName | 阶段名称 |
| StageOrder | 阶段序号 |
| Description | 阶段描述 |
| Weight | 权重比例 |

### 6.3 实训评价体系

#### 6.3.1 评价维度

| 评价维度 | 权重 | 评分标准 |
|----------|------|----------|
| 完成度 | 40% | 是否完成所有要求 |
| 正确性 | 40% | 结果准确性 |
| 规范性 | 20% | 操作规范性 |

#### 6.3.2 评价角色

| 角色 | 权重 | 说明 |
|------|------|------|
| 自评 | 30% | 学生自我评价 |
| 师评 | 70% | 教师评价 |

---

## 7. 接口规格

### 7.1 用户认证接口

#### 7.1.1 登录

```
POST /api/auth/login
Request:
{
  "username": "CLG",
  "password": "258258258"
}

Response:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "userInfo": {
      "userId": 1,
      "username": "CLG",
      "realName": "CLG",
      "role": "admin"
    }
  }
}
```

#### 7.1.2 登出

```
POST /api/auth/logout
Headers: Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "登出成功"
}
```

### 7.2 销售管理接口

#### 7.2.1 销售订单管理

```
GET /api/sales/orders
Query:
  - page: int (default: 1)
  - pageSize: int (default: 20)
  - customerId: int (optional)
  - status: string (optional)
  - startDate: string (optional)
  - endDate: string (optional)

Response:
{
  "code": 200,
  "data": {
    "total": 50,
    "list": [
      {
        "orderId": 1,
        "orderNo": "XS202501001",
        "customerId": 1,
        "customerName": "客户A",
        "orderDate": "2025-01-01",
        "totalAmount": 10000.00,
        "status": "completed",
        "creator": "CLG"
      }
    ]
  }
}
```

#### 7.2.2 创建销售订单

```
POST /api/sales/orders
Headers: Authorization: Bearer {token}
Request:
{
  "customerId": 1,
  "orderDate": "2025-01-01",
  "deliveryDate": "2025-01-15",
  "details": [
    {
      "productId": 1,
      "quantity": 100,
      "unitPrice": 100.00
    }
  ]
}

Response:
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "orderId": 1,
    "orderNo": "XS202501001"
  }
}
```

### 7.3 采购管理接口

```
GET /api/purchase/orders
POST /api/purchase/orders
GET /api/purchase/orders/:id
PUT /api/purchase/orders/:id
DELETE /api/purchase/orders/:id
```

### 7.4 生产管理接口

```
GET /api/production/plans
POST /api/production/plans
GET /api/production/recipes
POST /api/production/recipes
GET /api/production/statistics
```

### 7.5 仓库管理接口

```
GET /api/warehouse/inventory
GET /api/warehouse/inventory/:warehouseId
POST /api/warehouse/stock/in
POST /api/warehouse/stock/out
POST /api/warehouse/transfer
```

### 7.6 财务管理接口

```
GET /api/finance/receivables
POST /api/finance/receivables
GET /api/finance/payables
POST /api/finance/payables
GET /api/finance/expenses
POST /api/finance/expenses
```

---

## 8. 非功能性需求

### 8.1 性能需求

| 指标 | 要求 |
|------|------|
| 系统响应时间 | ≤ 3秒（普通操作），≤ 10秒（复杂查询） |
| 并发用户数 | ≥ 100 |
| 系统可用性 | ≥ 99.5% |
| 数据准确性 | ≥ 99.99% |
| 页面加载时间 | ≤ 2秒 |

### 8.2 安全需求

| 安全项 | 要求 |
|--------|------|
| 身份认证 | JWT Token，有效期24小时 |
| 密码加密 | BCrypt加密 |
| SQL注入防护 | 参数化查询 |
| XSS防护 | 输入过滤、输出编码 |
| CSRF防护 | Token验证 |
| 会话管理 | Redis集中存储 |
| 敏感操作日志 | 完整记录 |

### 8.3 兼容性需求

| 项目 | 要求 |
|------|------|
| 浏览器支持 | Chrome 80+, Firefox 75+, Safari 13+, Edge 80+ |
| 移动端支持 | iOS 12+, Android 8+ |
| 响应式布局 | 支持1024px-1920px分辨率 |

---

## 9. 项目约束

### 9.1 技术约束

- 后端：必须使用Java/Spring Boot或Node.js/NestJS
- 前端：必须使用Vue 3 + TypeScript
- 数据库：必须使用MySQL 8.0+或PostgreSQL
- 部署：必须支持Docker容器化部署
- API：必须遵循RESTful规范

### 9.2 时间约束

- 需求分析阶段：2周
- 系统设计阶段：2周
- 开发阶段：8周
- 测试阶段：3周
- 部署上线：1周

---

## 10. 术语表

| 术语 | 说明 |
|------|------|
| ERP | Enterprise Resource Planning，企业资源计划 |
| B/S架构 | Browser/Server，浏览器/服务器架构 |
| ASP | Active Server Pages，微软服务端脚本技术 |
| Session | 会话状态管理机制 |
| ADO | ActiveX Data Objects，数据访问组件 |
| JWT | JSON Web Token，身份认证令牌 |
| RESTful | REST风格的API设计规范 |

---

## 11. 后续需求确认计划

### 11.1 必须补充的信息

- [ ] 确认每个功能页面的详细表单字段
- [ ] 确认每个列表页面的查询条件
- [ ] 确认每个模块的业务规则
- [ ] 确认数据校验规则
- [ ] 确认工作流审批流程

### 11.2 获取信息的方法

1. **提供数据库**：Access数据库文件或SQL Server备份
2. **提供源码**：ASP页面源码和数据库连接文件
3. **屏幕截图**：每个功能页面的截图

---

**文档状态**：✓ 已对齐ERP系统功能模块

**文档版本**：3.0

**最后更新**：2026-05-20

**下一步行动**：继续深入探索每个功能模块的详细字段和业务规则
