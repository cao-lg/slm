# 数据字典与代码实现对齐规格说明书

## 文档信息

| 项目 | 说明 |
|------|------|
| 文档名称 | 数据字典与代码实现对齐规格说明书 |
| 版本 | 1.0 |
| 日期 | 2026-05-21 |
| 目标 | 对齐最新数据字典与现有代码实现 |

---

## 1. 问题说明

经过对比最新更新的数据字典和现有代码实现，发现多处严重不一致：

### 1.1 核心问题

1. **Customer.java** - 缺少客户扩展字段（地区、城市、信用管理等）
2. **QuotationDetail.java** - 缺少客产品/工产品代码、成本价等字段
3. **SalesOrder.java** - 缺少总数量、总成本、总利润等计算字段
4. **SalesOrderDetail.java** - 缺少客产品/工产品代码、成本价、利润等字段
5. **PurchaseOrder.java** - 缺少入库进度跟踪字段
6. **PurchaseOrderDetail.java** - 使用ProductID而非MaterialID，缺少供应商产品代码等
7. **Material.java** - 原材料实体类缺失

---

## 2. 需要修改的实体类

### 2.1 Customer.java

**现状**：缺少客户扩展字段

**需要添加的字段**：
```java
// 客户简称
private String customerShortName;

// 省/地区
private String province;

// 城市
private String city;

// 交期天
private Integer deliveryDays;

// 帐期天
private Integer paymentDays;

// 信用额度
private BigDecimal creditLimit;

// 已用信用额度
private BigDecimal usedCredit;
```

**影响范围**：
- 后端：Customer.java 实体类
- 数据库：customer 表结构
- 前端：客户管理页面表单和列表

### 2.2 QuotationDetail.java

**现状**：缺少客户产品对应信息

**需要添加的字段**：
```java
// 客产品代码
private String customerProductCode;

// 客产品名称
private String customerProductName;

// 工产品代码
private String ourProductCode;

// 工产品名称
private String ourProductName;

// 折前价
private BigDecimal originalPrice;

// 成本价
private BigDecimal costPrice;

// 附图
private String attachment;

// 备注
private String remark;
```

**影响范围**：
- 后端：QuotationDetail.java 实体类
- 数据库：quotation_detail 表结构
- 前端：报价单明细编辑页面

### 2.3 SalesOrder.java

**现状**：缺少订单统计字段

**需要添加的字段**：
```java
// 总数量
private BigDecimal totalQuantity;

// 总成本
private BigDecimal totalCost;

// 总利润
private BigDecimal totalProfit;

// 备注
private String remark;
```

**影响范围**：
- 后端：SalesOrder.java 实体类
- 数据库：sales_order 表结构
- 前端：销售订单列表和详情页面

### 2.4 SalesOrderDetail.java

**现状**：缺少客户产品对应信息和成本利润字段

**需要添加的字段**：
```java
// 客产品代码
private String customerProductCode;

// 客产品名称
private String customerProductName;

// 工产品代码
private String ourProductCode;

// 工产品名称
private String ourProductName;

// 折前价
private BigDecimal originalPrice;

// 成本价
private BigDecimal costPrice;

// 利润
private BigDecimal profit;

// 备注
private String remark;
```

**影响范围**：
- 后端：SalesOrderDetail.java 实体类
- 数据库：sales_order_detail 表结构
- 前端：销售订单明细编辑页面

### 2.5 PurchaseOrder.java

**现状**：缺少入库进度跟踪字段

**需要添加的字段**：
```java
// 要求入库日期
private LocalDateTime requestedDate;

// 收货入库日期
private LocalDateTime receivedDate;

// 总订量
private BigDecimal totalQuantity;

// 已入库数量
private BigDecimal receivedQuantity;

// 剩余数量
private BigDecimal remainingQuantity;

// 备注
private String remark;
```

**影响范围**：
- 后端：PurchaseOrder.java 实体类
- 数据库：purchase_order 表结构
- 前端：采购订单列表和详情页面

### 2.6 PurchaseOrderDetail.java

**现状**：使用ProductID而非MaterialID，缺少供应商关联字段

**需要修改的字段**：
```java
// 修改为 MaterialID
private Integer materialID;
```

**需要添加的字段**：
```java
// 供应商产品代码
private String supplierProductCode;

// 供应商产品名称
private String supplierProductName;

// 我们的材料代码
private String ourMaterialCode;

// 我们的材料名称
private String ourMaterialName;

// 已入库数量
private BigDecimal receivedQuantity;

// 剩余数量
private BigDecimal remainingQuantity;

// 备注
private String remark;
```

**影响范围**：
- 后端：PurchaseOrderDetail.java 实体类
- 数据库：purchase_order_detail 表结构
- 前端：采购订单明细编辑页面

### 2.7 Material.java（新建）

**现状**：原材料实体类不存在

**需要创建的字段**：
```java
package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("material")
public class Material implements Serializable {

    @TableId(value = "MaterialID", type = IdType.AUTO)
    private Integer materialID;

    private String materialCode;

    private String materialName;

    private String category;

    private String unit;

    private String spec;

    private BigDecimal cost;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    private LocalDateTime updateDate;
}
```

**影响范围**：
- 后端：新建 Material.java 实体类
- 数据库：新建 material 表
- 前端：原材料管理页面

---

## 3. 数据库迁移

### 3.1 客户表修改 (ALTER TABLE customer)

```sql
-- 添加客户扩展字段
ALTER TABLE customer 
ADD COLUMN customerShortName VARCHAR(100) COMMENT '客户简称' AFTER customerName,
ADD COLUMN province VARCHAR(50) COMMENT '省/地区' AFTER customerShortName,
ADD COLUMN city VARCHAR(50) COMMENT '城市' AFTER province,
ADD COLUMN deliveryDays INT DEFAULT 0 COMMENT '交期天' AFTER city,
ADD COLUMN paymentDays INT DEFAULT 0 COMMENT '帐期天' AFTER deliveryDays,
ADD COLUMN creditLimit DECIMAL(12,2) DEFAULT 0.00 COMMENT '信用额度' AFTER paymentDays,
ADD COLUMN usedCredit DECIMAL(12,2) DEFAULT 0.00 COMMENT '已用信用额度' AFTER creditLimit;
```

### 3.2 报价单明细表修改 (ALTER TABLE quotation_detail)

```sql
-- 添加客户产品对应信息和价格字段
ALTER TABLE quotation_detail
ADD COLUMN customerProductCode VARCHAR(50) COMMENT '客产品代码' AFTER productID,
ADD COLUMN customerProductName VARCHAR(200) COMMENT '客产品名称' AFTER customerProductCode,
ADD COLUMN ourProductCode VARCHAR(50) COMMENT '工产品代码' AFTER customerProductName,
ADD COLUMN ourProductName VARCHAR(200) COMMENT '工产品名称' AFTER ourProductCode,
ADD COLUMN originalPrice DECIMAL(12,2) DEFAULT 0.00 COMMENT '折前价' AFTER quantity,
ADD COLUMN costPrice DECIMAL(12,2) DEFAULT 0.00 COMMENT '成本价' AFTER unitPrice,
ADD COLUMN attachment VARCHAR(500) COMMENT '附图' AFTER amount,
ADD COLUMN remark VARCHAR(500) COMMENT '备注' AFTER attachment;
```

### 3.3 销售订单表修改 (ALTER TABLE sales_order)

```sql
-- 添加订单统计字段
ALTER TABLE sales_order
ADD COLUMN totalQuantity DECIMAL(12,2) DEFAULT 0.00 COMMENT '总数量' AFTER deliveryDate,
ADD COLUMN totalCost DECIMAL(12,2) DEFAULT 0.00 COMMENT '总成本' AFTER totalQuantity,
ADD COLUMN totalProfit DECIMAL(12,2) DEFAULT 0.00 COMMENT '总利润' AFTER totalCost,
ADD COLUMN remark VARCHAR(500) COMMENT '备注' AFTER totalProfit;
```

### 3.4 销售订单明细表修改 (ALTER TABLE sales_order_detail)

```sql
-- 添加客户产品对应信息和成本利润字段
ALTER TABLE sales_order_detail
ADD COLUMN customerProductCode VARCHAR(50) COMMENT '客产品代码' AFTER productID,
ADD COLUMN customerProductName VARCHAR(200) COMMENT '客产品名称' AFTER customerProductCode,
ADD COLUMN ourProductCode VARCHAR(50) COMMENT '工产品代码' AFTER customerProductName,
ADD COLUMN ourProductName VARCHAR(200) COMMENT '工产品名称' AFTER ourProductCode,
ADD COLUMN originalPrice DECIMAL(12,2) DEFAULT 0.00 COMMENT '折前价' AFTER quantity,
ADD COLUMN costPrice DECIMAL(12,2) DEFAULT 0.00 COMMENT '成本价' AFTER unitPrice,
ADD COLUMN profit DECIMAL(12,2) DEFAULT 0.00 COMMENT '利润' AFTER costPrice,
ADD COLUMN remark VARCHAR(500) COMMENT '备注' AFTER profit;
```

### 3.5 采购订单表修改 (ALTER TABLE purchase_order)

```sql
-- 添加入库进度跟踪字段
ALTER TABLE purchase_order
ADD COLUMN requestedDate DATETIME COMMENT '要求入库日期' AFTER deliveryDate,
ADD COLUMN receivedDate DATETIME COMMENT '收货入库日期' AFTER requestedDate,
ADD COLUMN totalQuantity DECIMAL(12,2) DEFAULT 0.00 COMMENT '总订量' AFTER receivedDate,
ADD COLUMN receivedQuantity DECIMAL(12,2) DEFAULT 0.00 COMMENT '已入库数量' AFTER totalQuantity,
ADD COLUMN remainingQuantity DECIMAL(12,2) DEFAULT 0.00 COMMENT '剩余数量' AFTER receivedQuantity,
ADD COLUMN remark VARCHAR(500) COMMENT '备注' AFTER remainingQuantity;
```

### 3.6 采购订单明细表修改 (ALTER TABLE purchase_order_detail)

```sql
-- 修改产品ID为原材料ID，添加供应商关联字段
ALTER TABLE purchase_order_detail
CHANGE COLUMN productID materialID INT COMMENT '原材料ID' AFTER poID,
ADD COLUMN supplierProductCode VARCHAR(50) COMMENT '供应商产品代码' AFTER materialID,
ADD COLUMN supplierProductName VARCHAR(200) COMMENT '供应商产品名称' AFTER supplierProductCode,
ADD COLUMN ourMaterialCode VARCHAR(50) COMMENT '我们的材料代码' AFTER supplierProductName,
ADD COLUMN ourMaterialName VARCHAR(200) COMMENT '我们的材料名称' AFTER ourMaterialCode,
ADD COLUMN receivedQuantity DECIMAL(12,2) DEFAULT 0.00 COMMENT '已入库数量' AFTER quantity,
ADD COLUMN remainingQuantity DECIMAL(12,2) DEFAULT 0.00 COMMENT '剩余数量' AFTER receivedQuantity,
ADD COLUMN remark VARCHAR(500) COMMENT '备注' AFTER remainingQuantity;
```

### 3.7 新建原材料表 (CREATE TABLE material)

```sql
CREATE TABLE material (
    MaterialID INT PRIMARY KEY AUTO_INCREMENT COMMENT '原材料ID',
    MaterialCode VARCHAR(50) NOT NULL COMMENT '原材料编号',
    MaterialName VARCHAR(200) NOT NULL COMMENT '原材料名称',
    Category VARCHAR(50) COMMENT '原材料类别',
    Unit VARCHAR(20) COMMENT '单位',
    Spec VARCHAR(200) COMMENT '规格',
    Cost DECIMAL(12,2) DEFAULT 0.00 COMMENT '成本单价',
    Status INT DEFAULT 1 COMMENT '状态(0禁用/1启用)',
    CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UpdateDate DATETIME COMMENT '更新时间',
    UNIQUE KEY idx_code (MaterialCode),
    KEY idx_name (MaterialName),
    KEY idx_category (Category),
    KEY idx_material_status (Status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='原材料表';
```

---

## 4. 前端修改

### 4.1 客户管理页面
- 添加客户简称字段
- 添加地区/城市下拉选择
- 添加交期天、帐期天输入
- 添加信用额度、已用信用额度显示

### 4.2 报价单页面
- 报价明细添加客产品代码/名称列
- 报价明细添加工产品代码/名称列
- 报价明细添加折前价、成本价列
- 报价明细添加附图上传、备注输入

### 4.3 销售订单页面
- 订单列表添加总数量、总成本、总利润列
- 订单明细添加客产品代码/名称列
- 订单明细添加工产品代码/名称列
- 订单明细添加折前价、成本价、利润列

### 4.4 采购订单页面
- 订单列表添加要求入库日期、收货入库日期列
- 订单列表添加订量(已入+剩余)列
- 订单明细添加供应商产品代码/名称列
- 订单明细添加已入库数量、剩余数量列

### 4.5 原材料管理页面
- 创建独立的原材料管理模块
- 原材料列表和编辑页面

---

## 5. 状态枚举值更新

### 5.1 报价单状态
**数据字典定义**：unquoted/quoted/confirmed
**当前实现**：pending/accepted/rejected

**需要修改的位置**：
- 后端：Quotation.java 实体类注释
- 前端：报价单列表页面状态筛选
- 前端：报价单表单状态选项

### 5.2 销售订单状态
**数据字典定义**：pending/unfinished/inventory/producing/stocked/shipped/completed
**当前实现**：pending/producing/shipped/completed

**需要修改的位置**：
- 后端：SalesOrder.java 实体类注释
- 前端：销售订单列表页面状态标签
- 前端：销售订单表单状态选项

### 5.3 采购订单状态
**数据字典定义**：pending/approved/stocked/cancelled
**当前实现**：pending/received/completed

**需要修改的位置**：
- 后端：PurchaseOrder.java 实体类注释
- 前端：采购订单列表页面状态标签
- 前端：采购订单表单状态选项

---

## 6. 实施计划

### 阶段一：数据库迁移（优先级：高）
1. 执行 ALTER TABLE 语句修改现有表结构
2. 创建 material 原材料表
3. 备份现有数据

### 阶段二：后端实体类修改（优先级：高）
1. 修改 Customer.java
2. 修改 QuotationDetail.java
3. 修改 SalesOrder.java
4. 修改 SalesOrderDetail.java
5. 修改 PurchaseOrder.java
6. 修改 PurchaseOrderDetail.java
7. 创建 Material.java

### 阶段三：前端页面修改（优先级：中）
1. 修改客户管理页面
2. 修改报价单页面
3. 修改销售订单页面
4. 修改采购订单页面
5. 创建原材料管理页面

### 阶段四：测试验证（优先级：高）
1. 单元测试
2. 集成测试
3. 数据一致性验证

---

**文档状态**：待执行

**版本**：1.0

**最后更新**：2026-05-21
