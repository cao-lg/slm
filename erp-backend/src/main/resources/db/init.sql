-- ERP系统数据库初始化脚本
-- 版本: 1.0
-- 日期: 2026-05-20

-- 创建数据库
CREATE DATABASE IF NOT EXISTS erp_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE erp_db;

-- 1. 用户表
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `UserID` INT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `UserName` VARCHAR(50) NOT NULL COMMENT '用户名',
  `Password` VARCHAR(255) NOT NULL COMMENT '密码',
  `RealName` VARCHAR(100) DEFAULT NULL COMMENT '真实姓名',
  `Role` VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色：admin管理员/user普通用户',
  `Department` VARCHAR(100) DEFAULT NULL COMMENT '部门',
  `Email` VARCHAR(100) DEFAULT NULL COMMENT '电子邮箱',
  `Phone` VARCHAR(50) DEFAULT NULL COMMENT '联系电话',
  `Status` INT NOT NULL DEFAULT 1 COMMENT '状态：0禁用，1启用',
  `LastLoginDate` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `idx_username` (`UserName`),
  KEY `idx_role` (`Role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入默认管理员用户 (密码: 258258258)
INSERT INTO `user` (`UserName`, `Password`, `RealName`, `Role`, `Department`, `Status`) VALUES
('CLG', '258258258', '陈立国', 'admin', '系统管理', 1);

-- 2. 客户表
DROP TABLE IF EXISTS `customer`;
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

-- 3. 供应商表
DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `SupplierID` INT NOT NULL AUTO_INCREMENT COMMENT '供应商ID',
  `SupplierCode` VARCHAR(50) NOT NULL COMMENT '供应商编号',
  `SupplierName` VARCHAR(200) NOT NULL COMMENT '供应商名称',
  `Contact` VARCHAR(100) DEFAULT NULL COMMENT '联系人',
  `Phone` VARCHAR(50) DEFAULT NULL COMMENT '联系电话',
  `Fax` VARCHAR(50) DEFAULT NULL COMMENT '传真',
  `Email` VARCHAR(100) DEFAULT NULL COMMENT '电子邮箱',
  `Address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `Status` INT NOT NULL DEFAULT 1 COMMENT '状态：0禁用，1启用',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`SupplierID`),
  UNIQUE KEY `idx_code` (`SupplierCode`),
  KEY `idx_name` (`SupplierName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

-- 4. 产品表
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `ProductID` INT NOT NULL AUTO_INCREMENT COMMENT '产品ID',
  `ProductCode` VARCHAR(50) NOT NULL COMMENT '产品编号',
  `ProductName` VARCHAR(200) NOT NULL COMMENT '产品名称',
  `Category` VARCHAR(50) DEFAULT NULL COMMENT '产品类别',
  `Unit` VARCHAR(20) DEFAULT NULL COMMENT '单位',
  `Spec` VARCHAR(200) DEFAULT NULL COMMENT '规格',
  `Price` DECIMAL(12,2) DEFAULT 0.00 COMMENT '销售单价',
  `Cost` DECIMAL(12,2) DEFAULT 0.00 COMMENT '成本单价',
  `Status` INT NOT NULL DEFAULT 1 COMMENT '状态：0禁用，1启用',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`ProductID`),
  UNIQUE KEY `idx_code` (`ProductCode`),
  KEY `idx_name` (`ProductName`),
  KEY `idx_category` (`Category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品表';

-- 5. 仓库表
DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE `warehouse` (
  `WarehouseID` INT NOT NULL AUTO_INCREMENT COMMENT '仓库ID',
  `WarehouseCode` VARCHAR(50) NOT NULL COMMENT '仓库编号',
  `WarehouseName` VARCHAR(100) NOT NULL COMMENT '仓库名称',
  `Type` VARCHAR(50) NOT NULL COMMENT '仓库类型：车间仓/成品仓/材料仓/外仓/待处理仓',
  `Location` VARCHAR(200) DEFAULT NULL COMMENT '仓库位置',
  `Manager` VARCHAR(100) DEFAULT NULL COMMENT '仓库管理员',
  `Status` INT NOT NULL DEFAULT 1 COMMENT '状态：0禁用，1启用',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`WarehouseID`),
  UNIQUE KEY `idx_code` (`WarehouseCode`),
  KEY `idx_type` (`Type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='仓库表';

-- 插入默认仓库
INSERT INTO `warehouse` (`WarehouseCode`, `WarehouseName`, `Type`, `Status`) VALUES
('KCA', '车间仓', '车间仓', 1),
('KCB', '成品仓', '成品仓', 1),
('KCC', '材料仓', '材料仓', 1),
('KCD', '外仓', '外仓', 1),
('KCE', '待处理仓', '待处理仓', 1);

-- 6. 报价单表
DROP TABLE IF EXISTS `quotation`;
CREATE TABLE `quotation` (
  `QuotationID` INT NOT NULL AUTO_INCREMENT COMMENT '报价ID',
  `QuotationNo` VARCHAR(50) NOT NULL COMMENT '报价单号',
  `CustomerID` INT NOT NULL COMMENT '客户ID',
  `QuotationDate` DATETIME NOT NULL COMMENT '报价日期',
  `ValidUntil` DATETIME DEFAULT NULL COMMENT '有效期至',
  `TotalAmount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '报价总额',
  `Status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态：pending待确认/accepted已接受/rejected已拒绝',
  `Creator` VARCHAR(50) DEFAULT NULL COMMENT '制单人',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`QuotationID`),
  UNIQUE KEY `idx_no` (`QuotationNo`),
  KEY `idx_customer` (`CustomerID`),
  KEY `idx_date` (`QuotationDate`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报价单表';

-- 7. 报价单明细表
DROP TABLE IF EXISTS `quotation_detail`;
CREATE TABLE `quotation_detail` (
  `DetailID` INT NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `QuotationID` INT NOT NULL COMMENT '报价单ID',
  `ProductID` INT NOT NULL COMMENT '产品ID',
  `Quantity` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '数量',
  `UnitPrice` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '单价',
  `Amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '金额',
  PRIMARY KEY (`DetailID`),
  KEY `idx_quotation` (`QuotationID`),
  KEY `idx_product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报价单明细表';

-- 8. 销售订单表
DROP TABLE IF EXISTS `sales_order`;
CREATE TABLE `sales_order` (
  `OrderID` INT NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `OrderNo` VARCHAR(50) NOT NULL COMMENT '订单编号',
  `CustomerID` INT NOT NULL COMMENT '客户ID',
  `OrderDate` DATETIME NOT NULL COMMENT '订单日期',
  `DeliveryDate` DATETIME DEFAULT NULL COMMENT '交货日期',
  `TotalAmount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '订单总额',
  `Status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态：pending已下单/producing生产中/shipped已发货/completed已完成',
  `Creator` VARCHAR(50) DEFAULT NULL COMMENT '制单人',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`OrderID`),
  UNIQUE KEY `idx_no` (`OrderNo`),
  KEY `idx_customer` (`CustomerID`),
  KEY `idx_date` (`OrderDate`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售订单表';

-- 9. 销售订单明细表
DROP TABLE IF EXISTS `sales_order_detail`;
CREATE TABLE `sales_order_detail` (
  `DetailID` INT NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `OrderID` INT NOT NULL COMMENT '订单ID',
  `ProductID` INT NOT NULL COMMENT '产品ID',
  `Quantity` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '数量',
  `UnitPrice` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '单价',
  `Amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '金额',
  PRIMARY KEY (`DetailID`),
  KEY `idx_order` (`OrderID`),
  KEY `idx_product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售订单明细表';

-- 10. 采购订单表
DROP TABLE IF EXISTS `purchase_order`;
CREATE TABLE `purchase_order` (
  `POID` INT NOT NULL AUTO_INCREMENT COMMENT '采购单ID',
  `PONo` VARCHAR(50) NOT NULL COMMENT '采购单编号',
  `SupplierID` INT NOT NULL COMMENT '供应商ID',
  `OrderDate` DATETIME NOT NULL COMMENT '采购日期',
  `DeliveryDate` DATETIME DEFAULT NULL COMMENT '交货日期',
  `TotalAmount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '采购总额',
  `Status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态：pending已下单/received已收货/completed已完成',
  `Creator` VARCHAR(50) DEFAULT NULL COMMENT '制单人',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`POID`),
  UNIQUE KEY `idx_no` (`PONo`),
  KEY `idx_supplier` (`SupplierID`),
  KEY `idx_date` (`OrderDate`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购订单表';

-- 11. 采购订单明细表
DROP TABLE IF EXISTS `purchase_order_detail`;
CREATE TABLE `purchase_order_detail` (
  `DetailID` INT NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `POID` INT NOT NULL COMMENT '采购单ID',
  `ProductID` INT NOT NULL COMMENT '产品ID',
  `Quantity` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '数量',
  `UnitPrice` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '单价',
  `Amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '金额',
  PRIMARY KEY (`DetailID`),
  KEY `idx_po` (`POID`),
  KEY `idx_product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购订单明细表';

-- 12. 生产计划表
DROP TABLE IF EXISTS `production_plan`;
CREATE TABLE `production_plan` (
  `PlanID` INT NOT NULL AUTO_INCREMENT COMMENT '计划ID',
  `PlanNo` VARCHAR(50) NOT NULL COMMENT '计划编号',
  `ProductID` INT NOT NULL COMMENT '产品ID',
  `Quantity` INT NOT NULL DEFAULT 0 COMMENT '计划数量',
  `StartDate` DATETIME DEFAULT NULL COMMENT '开始日期',
  `EndDate` DATETIME DEFAULT NULL COMMENT '结束日期',
  `Status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态：pending待生产/producing生产中/completed已完成',
  `Creator` VARCHAR(50) DEFAULT NULL COMMENT '制单人',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`PlanID`),
  UNIQUE KEY `idx_no` (`PlanNo`),
  KEY `idx_product` (`ProductID`),
  KEY `idx_date` (`StartDate`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='生产计划表';

-- 13. 配方表
DROP TABLE IF EXISTS `recipe`;
CREATE TABLE `recipe` (
  `RecipeID` INT NOT NULL AUTO_INCREMENT COMMENT '配方ID',
  `ProductID` INT NOT NULL COMMENT '产品ID',
  `RecipeName` VARCHAR(200) NOT NULL COMMENT '配方名称',
  `Materials` TEXT DEFAULT NULL COMMENT '材料清单（JSON格式）',
  `Ratios` VARCHAR(500) DEFAULT NULL COMMENT '材料配比',
  `Status` INT NOT NULL DEFAULT 1 COMMENT '状态：0禁用，1启用',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`RecipeID`),
  KEY `idx_product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='配方表';

-- 14. 库存表
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `InventoryID` INT NOT NULL AUTO_INCREMENT COMMENT '库存ID',
  `WarehouseID` INT NOT NULL COMMENT '仓库ID',
  `ProductID` INT NOT NULL COMMENT '产品ID',
  `Quantity` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '库存数量',
  `UnitCost` DECIMAL(12,2) DEFAULT 0.00 COMMENT '单位成本',
  `Location` VARCHAR(100) DEFAULT NULL COMMENT '库位',
  `UpdateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`InventoryID`),
  UNIQUE KEY `idx_warehouseproduct` (`WarehouseID`, `ProductID`),
  KEY `idx_product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存表';

-- 15. 应收款表
DROP TABLE IF EXISTS `receivable`;
CREATE TABLE `receivable` (
  `ReceivableID` INT NOT NULL AUTO_INCREMENT COMMENT '应收ID',
  `ReceivableNo` VARCHAR(50) NOT NULL COMMENT '应收单号',
  `CustomerID` INT NOT NULL COMMENT '客户ID',
  `SalesOrderID` INT DEFAULT NULL COMMENT '关联销售订单',
  `TotalAmount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '应收总金额',
  `ReceivedAmount` DECIMAL(12,2) DEFAULT 0.00 COMMENT '已收金额',
  `PendingAmount` DECIMAL(12,2) DEFAULT 0.00 COMMENT '待收金额',
  `DueDate` DATETIME DEFAULT NULL COMMENT '到期日期',
  `Status` VARCHAR(20) NOT NULL DEFAULT 'unpaid' COMMENT '状态：unpaid未付款/partial部分付款/paid已付清',
  `PaymentMethod` VARCHAR(50) COMMENT '付款方式',
  `LastPaymentDate` DATETIME COMMENT '最后付款日期',
  `Remark` VARCHAR(500) COMMENT '备注',
  `Creator` VARCHAR(100) COMMENT '创建人',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`ReceivableID`),
  KEY `idx_customer` (`CustomerID`),
  KEY `idx_order` (`SalesOrderID`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应收款表';

-- 16. 应付款表
DROP TABLE IF EXISTS `payable`;
CREATE TABLE `payable` (
  `PayableID` INT NOT NULL AUTO_INCREMENT COMMENT '应付ID',
  `PayableNo` VARCHAR(50) NOT NULL COMMENT '应付单号',
  `SupplierID` INT NOT NULL COMMENT '供应商ID',
  `PurchaseOrderID` INT DEFAULT NULL COMMENT '关联采购订单',
  `TotalAmount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '应付总金额',
  `PaidAmount` DECIMAL(12,2) DEFAULT 0.00 COMMENT '已付金额',
  `PendingAmount` DECIMAL(12,2) DEFAULT 0.00 COMMENT '待付金额',
  `DueDate` DATETIME DEFAULT NULL COMMENT '到期日期',
  `Status` VARCHAR(20) NOT NULL DEFAULT 'unpaid' COMMENT '状态：unpaid未付款/partial部分付款/paid已付清',
  `PaymentMethod` VARCHAR(50) COMMENT '付款方式',
  `LastPaymentDate` DATETIME COMMENT '最后付款日期',
  `Remark` VARCHAR(500) COMMENT '备注',
  `Creator` VARCHAR(100) COMMENT '创建人',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`PayableID`),
  KEY `idx_supplier` (`SupplierID`),
  KEY `idx_order` (`PurchaseOrderID`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应付款表';

-- 17. 报销表
DROP TABLE IF EXISTS `expense`;
CREATE TABLE `expense` (
  `ExpenseID` INT NOT NULL AUTO_INCREMENT COMMENT '报销ID',
  `EmployeeID` INT NOT NULL COMMENT '员工ID',
  `ExpenseType` VARCHAR(50) NOT NULL COMMENT '费用类型',
  `Amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '报销金额',
  `Description` TEXT DEFAULT NULL COMMENT '费用说明',
  `Receipts` VARCHAR(500) DEFAULT NULL COMMENT '收据附件',
  `Status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态：pending待审批/approved已批准/rejected已拒绝/paid已报销',
  `Approver` VARCHAR(50) DEFAULT NULL COMMENT '审批人',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateDate` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`ExpenseID`),
  KEY `idx_employee` (`EmployeeID`),
  KEY `idx_type` (`ExpenseType`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报销表';

-- 18. 站内消息表
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `MessageID` INT NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `FromUserID` INT NOT NULL COMMENT '发送者ID',
  `ToUserID` INT NOT NULL COMMENT '接收者ID',
  `Title` VARCHAR(200) DEFAULT NULL COMMENT '消息标题',
  `Content` TEXT NOT NULL COMMENT '消息内容',
  `IsRead` INT NOT NULL DEFAULT 0 COMMENT '已读状态：0未读，1已读',
  `ReadDate` DATETIME DEFAULT NULL COMMENT '阅读时间',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  PRIMARY KEY (`MessageID`),
  KEY `idx_from` (`FromUserID`),
  KEY `idx_to` (`ToUserID`),
  KEY `idx_read` (`IsRead`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站内消息表';

-- 19. 操作日志表
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
  `LogID` INT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `UserID` INT DEFAULT NULL COMMENT '操作用户ID',
  `Action` VARCHAR(100) NOT NULL COMMENT '操作类型',
  `Module` VARCHAR(50) DEFAULT NULL COMMENT '模块名称',
  `Description` VARCHAR(500) DEFAULT NULL COMMENT '操作描述',
  `IPAddress` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `CreateDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`LogID`),
  KEY `idx_user` (`UserID`),
  KEY `idx_action` (`Action`),
  KEY `idx_date` (`CreateDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 创建索引以提高查询性能
CREATE INDEX idx_customer_status ON customer(Status);
CREATE INDEX idx_supplier_status ON supplier(Status);
CREATE INDEX idx_product_status ON product(Status);
CREATE INDEX idx_warehouse_status ON warehouse(Status);
CREATE INDEX idx_receivable_status ON receivable(Status);
CREATE INDEX idx_payable_status ON payable(Status);
CREATE INDEX idx_expense_status ON expense(Status);
CREATE INDEX idx_user_status ON user(Status);
CREATE INDEX idx_inventory_warehouse ON inventory(WarehouseID);
CREATE INDEX idx_inventory_product ON inventory(ProductID);
