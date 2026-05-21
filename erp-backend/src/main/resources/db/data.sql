-- 测试数据初始化

-- 插入默认用户 (密码为258258258，BCrypt加密)
INSERT INTO `user` (`UserName`, `Password`, `RealName`, `Role`, `Department`, `Status`) 
VALUES ('CLG', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '陈立国', 'admin', '系统管理', 1);

-- 插入测试客户
INSERT INTO `customer` (`CustomerCode`, `CustomerName`, `Contact`, `Phone`, `Email`, `Address`, `Status`) VALUES
('KH202505200001', '北京科技有限公司', '张三', '13800138001', 'zhang@tech.com', '北京市朝阳区望京', 1),
('KH202505200002', '上海商贸集团', '李四', '13800138002', 'li@trade.com', '上海市浦东新区', 1),
('KH202505200003', '广州电子科技', '王五', '13800138003', 'wang@electronics.com', '广州市天河区', 1);

-- 插入测试供应商
INSERT INTO `supplier` (`SupplierCode`, `SupplierName`, `Contact`, `Phone`, `Email`, `Address`, `Status`) VALUES
('GYS202505200001', '深圳材料厂', '赵六', '13900139001', 'zhao@factory.com', '深圳市南山区', 1),
('GYS202505200002', '杭州化工公司', '钱七', '13900139002', 'qian@chemical.com', '杭州市西湖区', 1);

-- 插入测试产品
INSERT INTO `product` (`ProductCode`, `ProductName`, `Category`, `Unit`, `Spec`, `Price`, `Cost`, `Status`) VALUES
('CP202505200001', 'A型配件', '配件', '个', '直径10mm', 100.00, 50.00, 1),
('CP202505200002', 'B型组件', '组件', '套', '尺寸20x30cm', 200.00, 100.00, 1),
('CP202505200003', 'C型零件', '零件', '件', '长度5cm', 50.00, 25.00, 1);

-- 插入仓库
INSERT INTO `warehouse` (`WarehouseCode`, `WarehouseName`, `Type`, `Status`) VALUES
('KCA', '车间仓', '车间仓', 1),
('KCB', '成品仓', '成品仓', 1),
('KCC', '材料仓', '材料仓', 1),
('KCD', '外仓', '外仓', 1),
('KCE', '待处理仓', '待处理仓', 1);

-- 插入测试应收款数据
INSERT INTO `receivable` (`ReceivableNo`, `CustomerID`, `SalesOrderID`, `TotalAmount`, `ReceivedAmount`, `PendingAmount`, `DueDate`, `Status`, `Remark`, `Creator`, `CreateDate`) VALUES
('AR202505200001', 1, 1, 15000.00, 10000.00, 5000.00, '2024-02-15 00:00:00', 'partial', '部分收款', 'CLG', '2024-01-15 10:00:00'),
('AR202505200002', 2, 2, 20000.00, 20000.00, 0.00, '2024-02-20 00:00:00', 'completed', '', 'CLG', '2024-01-16 14:00:00'),
('AR202505200003', 3, 3, 8000.00, 0.00, 8000.00, '2024-03-01 00:00:00', 'pending', '新订单', 'CLG', '2024-01-18 09:00:00');

-- 插入测试应付款数据
INSERT INTO `payable` (`PayableNo`, `SupplierID`, `PurchaseOrderID`, `TotalAmount`, `PaidAmount`, `PendingAmount`, `DueDate`, `Status`, `Remark`, `Creator`, `CreateDate`) VALUES
('AP202505200001', 1, 1, 50000.00, 30000.00, 20000.00, '2024-02-10 00:00:00', 'partial', '', 'CLG', '2024-01-10 08:00:00'),
('AP202505200002', 2, 2, 30000.00, 0.00, 30000.00, '2024-03-15 00:00:00', 'pending', '原材料采购', 'CLG', '2024-01-15 10:00:00'),
('AP202505200003', 3, 3, 15000.00, 15000.00, 0.00, '2024-01-30 00:00:00', 'completed', '', 'CLG', '2024-01-05 14:00:00');

-- 插入测试报销数据
INSERT INTO `expense` (`ExpenseNo`, `ApplicantID`, `ApplicantName`, `Department`, `Amount`, `Category`, `Description`, `Status`, `ApproverID`, `ApproverName`, `ApproveDate`, `ApproveRemark`, `CreateDate`) VALUES
('EX202505200001', 1, '张三', '销售部', 1500.00, '差旅费', '北京出差三天，拜访客户', 'approved', 1, 'CLG', '2024-01-18 00:00:00', '同意报销', '2024-01-15 10:00:00'),
('EX202505200002', 2, '李四', '市场部', 800.00, '招待费', '客户招待费用', 'pending', NULL, NULL, NULL, NULL, '2024-01-19 14:00:00'),
('EX202505200003', 3, '王五', '研发部', 2000.00, '培训费', '技术培训课程费用', 'rejected', 1, 'CLG', '2024-01-20 00:00:00', '培训内容与工作无关', '2024-01-17 09:00:00');
