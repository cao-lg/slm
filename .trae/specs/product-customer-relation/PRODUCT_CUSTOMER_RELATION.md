# 产品与客户关联关系说明

**创建日期**: 2026-05-24  
**问题来源**: 用户测试反馈

---

## 1. 当前系统设计

### 1.1 产品和客户是独立实体

在当前ERP系统中，**产品（Product）** 和 **客户（Customer）** 是**两个独立的实体**，它们之间**没有直接关联**。

```sql
-- 产品表
CREATE TABLE product (
  productID INT PRIMARY KEY,
  productCode VARCHAR(50),
  productName VARCHAR(100),
  category VARCHAR(50),
  unit VARCHAR(20),
  spec VARCHAR(100),
  price DECIMAL(10,2),
  cost DECIMAL(10,2),
  status INT
);

-- 客户表
CREATE TABLE customer (
  customerID INT PRIMARY KEY,
  customerCode VARCHAR(50),
  customerName VARCHAR(100),
  contact VARCHAR(50),
  phone VARCHAR(20),
  creditLimit DECIMAL(10,2),
  status INT
);
```

### 1.2 它们通过业务单据关联

产品和客户通过以下业务单据关联：

```
客户 ──→ 报价单（包含客户ID + 产品明细）
         │
         ↓
      销售订单（包含客户ID + 产品明细）
         │
         ↓
      发货单（包含客户ID + 产品明细）
         │
         ↓
      应收款（包含客户ID）
```

---

## 2. 数据流程示例

### 场景：北京科技有限公司购买A型配件

**步骤1**: 客户下单（销售订单）
```json
{
  "orderID": 1,
  "customerID": 1,
  "customerName": "北京科技有限公司",
  "orderNo": "XS202505200001",
  "details": [
    {
      "productID": 1,
      "productName": "A型配件",
      "quantity": 10,
      "price": 100.00
    }
  ]
}
```

**步骤2**: 发货
```json
{
  "deliveryID": 1,
  "customerID": 1,
  "customerName": "北京科技有限公司",
  "details": [
    {
      "productID": 1,
      "productName": "A型配件",
      "quantity": 10
    }
  ]
}
```

**步骤3**: 生成应收款
```json
{
  "receivableID": 1,
  "customerID": 1,
  "customerName": "北京科技有限公司",
  "totalAmount": 1000.00
}
```

---

## 3. 为什么不直接关联？

### 3.1 设计原则

1. **解耦合**
   - 产品可以被多个客户购买
   - 客户可以购买多个产品
   - 避免形成复杂的网状关系

2. **业务灵活性**
   - 同一产品对不同客户可能有不同定价
   - 不同客户可能有不同的交货要求
   - 需要记录每个客户的购买历史

3. **数据一致性**
   - 产品信息变更不应影响历史订单
   - 客户信息变更不应影响历史订单
   - 每个业务单据都是独立的交易快照

### 3.2 常见的ERP设计模式

**当前设计**（交易导向）：
```
产品 ←→ 业务单据 ←→ 客户
```

**备选设计**（关系导向）：
```
产品 ←→ 客户产品定价表 ←→ 客户
```

---

## 4. 什么时候需要直接关联？

### 4.1 如果需要"客户专属产品"

**场景**: 某些产品只销售给特定客户

**解决方案**: 添加关联表
```sql
CREATE TABLE customer_product (
  id INT PRIMARY KEY,
  customerID INT,
  productID INT,
  specialPrice DECIMAL(10,2),
  effectiveDate DATE,
  expiryDate DATE
);
```

### 4.2 如果需要"客户专属价格"

**场景**: 同一产品对不同客户有不同价格

**解决方案**: 在报价单/订单中指定价格
```json
{
  "quotationID": 1,
  "customerID": 1,
  "details": [
    {
      "productID": 1,
      "productName": "A型配件",
      "standardPrice": 100.00,
      "specialPrice": 90.00,
      "quantity": 10
    }
  ]
}
```

### 4.3 如果需要"客户购买历史"

**场景**: 分析客户的购买偏好

**解决方案**: 查询历史订单
```sql
SELECT 
  c.customerName,
  p.productName,
  COUNT(*) as purchaseCount,
  SUM(od.quantity) as totalQuantity
FROM sales_order s
JOIN customer c ON s.customerID = c.customerID
JOIN order_detail od ON s.orderID = od.orderID
JOIN product p ON od.productID = p.productID
WHERE c.customerID = 1
GROUP BY c.customerName, p.productName;
```

---

## 5. 当前系统的查询示例

### 5.1 查询某个客户购买过的所有产品

```sql
SELECT DISTINCT
  p.productID,
  p.productName,
  p.category,
  COUNT(DISTINCT s.orderID) as orderCount,
  SUM(od.quantity) as totalQuantity
FROM sales_order s
JOIN customer c ON s.customerID = c.customerID
JOIN order_detail od ON s.orderID = od.orderID
JOIN product p ON od.productID = p.productID
WHERE c.customerID = 1
GROUP BY p.productID, p.productName, p.category;
```

### 5.2 查询某个产品的所有购买客户

```sql
SELECT DISTINCT
  c.customerID,
  c.customerName,
  COUNT(DISTINCT s.orderID) as orderCount,
  SUM(od.quantity) as totalQuantity
FROM sales_order s
JOIN customer c ON s.customerID = c.customerID
JOIN order_detail od ON s.orderID = od.orderID
WHERE od.productID = 1
GROUP BY c.customerID, c.customerName;
```

---

## 6. 结论

### 当前设计是合理的，因为：

1. ✅ **符合业务逻辑**: 产品和客户是独立的实体，通过交易关联
2. ✅ **易于扩展**: 可以轻松添加客户专属价格等功能
3. ✅ **数据一致性**: 历史订单不会因为产品或客户信息变更而受影响
4. ✅ **查询灵活**: 可以通过SQL轻松查询任意维度的关联数据

### 不需要直接关联的理由：

1. ❌ **产品表不应该有customerID**: 一个产品可以被多个客户购买
2. ❌ **客户表不应该有productID**: 一个客户可以购买多个产品
3. ❌ **多对多关系不应该用外键**: 应该通过关联表或业务单据实现

---

## 7. 后续优化建议

如果未来有需求，可以考虑：

1. **客户产品偏好分析**
   - 基于历史订单数据
   - 分析购买频率和数量
   - 推荐相似产品

2. **客户专属价格体系**
   - 创建客户价格表
   - 在报价/订单时自动应用专属价格
   - 设置价格有效期

3. **产品推荐系统**
   - 基于客户购买历史
   - 相似客户购买的产品
   - 热门产品推荐

---

**文档版本**: v1.0  
**最后更新**: 2026-05-24
