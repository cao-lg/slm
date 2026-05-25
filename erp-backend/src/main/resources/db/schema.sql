-- H2数据库初始化脚本

CREATE TABLE IF NOT EXISTS `user` (
    `UserID` INT AUTO_INCREMENT PRIMARY KEY,
    `UserName` VARCHAR(50) NOT NULL UNIQUE,
    `Password` VARCHAR(255) NOT NULL,
    `RealName` VARCHAR(100),
    `Role` VARCHAR(20) DEFAULT 'user',
    `Department` VARCHAR(100),
    `Email` VARCHAR(100),
    `Phone` VARCHAR(50),
    `Status` INT DEFAULT 1,
    `LastLoginDate` DATETIME,
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `customer` (
    `CustomerID` INT AUTO_INCREMENT PRIMARY KEY,
    `CustomerCode` VARCHAR(50) NOT NULL UNIQUE,
    `CustomerName` VARCHAR(200) NOT NULL,
    `CustomerShortName` VARCHAR(100),
    `Province` VARCHAR(50),
    `City` VARCHAR(50),
    `DeliveryDays` INT DEFAULT 0,
    `PaymentDays` INT DEFAULT 0,
    `CreditLimit` DECIMAL(12,2) DEFAULT 0,
    `UsedCredit` DECIMAL(12,2) DEFAULT 0,
    `Contact` VARCHAR(100),
    `Phone` VARCHAR(50),
    `Fax` VARCHAR(50),
    `Email` VARCHAR(100),
    `Address` VARCHAR(500),
    `Status` INT DEFAULT 1,
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `supplier` (
    `SupplierID` INT AUTO_INCREMENT PRIMARY KEY,
    `SupplierCode` VARCHAR(50) NOT NULL UNIQUE,
    `SupplierName` VARCHAR(200) NOT NULL,
    `Contact` VARCHAR(100),
    `Phone` VARCHAR(50),
    `Fax` VARCHAR(50),
    `Email` VARCHAR(100),
    `Address` VARCHAR(500),
    `Status` INT DEFAULT 1,
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `product` (
    `ProductID` INT AUTO_INCREMENT PRIMARY KEY,
    `ProductCode` VARCHAR(50) NOT NULL UNIQUE,
    `ProductName` VARCHAR(200) NOT NULL,
    `Category` VARCHAR(50),
    `Unit` VARCHAR(20),
    `Spec` VARCHAR(200),
    `Price` DECIMAL(12,2) DEFAULT 0,
    `Cost` DECIMAL(12,2) DEFAULT 0,
    `Status` INT DEFAULT 1,
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `warehouse` (
    `WarehouseID` INT AUTO_INCREMENT PRIMARY KEY,
    `WarehouseCode` VARCHAR(50) NOT NULL UNIQUE,
    `WarehouseName` VARCHAR(100) NOT NULL,
    `Type` VARCHAR(50),
    `Location` VARCHAR(200),
    `Manager` VARCHAR(100),
    `Status` INT DEFAULT 1,
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `inventory` (
    `InventoryID` INT AUTO_INCREMENT PRIMARY KEY,
    `WarehouseID` INT NOT NULL,
    `ProductID` INT,
    `MaterialID` INT,
    `Quantity` DECIMAL(12,2) DEFAULT 0,
    `UnitCost` DECIMAL(12,2) DEFAULT 0,
    `Location` VARCHAR(100),
    `UpdateDate` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `quotation` (
    `QuotationID` INT AUTO_INCREMENT PRIMARY KEY,
    `QuotationNo` VARCHAR(50) NOT NULL UNIQUE,
    `CustomerID` INT,
    `QuotationDate` DATETIME,
    `ValidUntil` DATETIME,
    `TotalAmount` DECIMAL(12,2) DEFAULT 0,
    `Status` VARCHAR(20) DEFAULT 'pending',
    `Remark` VARCHAR(500),
    `Creator` VARCHAR(100),
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `quotation_detail` (
    `DetailID` INT AUTO_INCREMENT PRIMARY KEY,
    `QuotationID` INT NOT NULL,
    `ProductID` INT,
    `ProductName` VARCHAR(200),
    `Unit` VARCHAR(20),
    `CustomerProductCode` VARCHAR(50),
    `CustomerProductName` VARCHAR(200),
    `OurProductCode` VARCHAR(50),
    `OurProductName` VARCHAR(200),
    `Quantity` DECIMAL(12,2) DEFAULT 0,
    `OriginalPrice` DECIMAL(12,2) DEFAULT 0,
    `UnitPrice` DECIMAL(12,2) DEFAULT 0,
    `CostPrice` DECIMAL(12,2) DEFAULT 0,
    `Amount` DECIMAL(12,2) DEFAULT 0,
    `Attachment` VARCHAR(500),
    `Remark` VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS `sales_order` (
    `SoID` INT AUTO_INCREMENT PRIMARY KEY,
    `OrderNo` VARCHAR(50) NOT NULL UNIQUE,
    `QuotationID` INT,
    `CustomerID` INT,
    `OrderDate` DATETIME,
    `DeliveryDate` DATETIME,
    `TotalQuantity` DECIMAL(12,2) DEFAULT 0,
    `TotalAmount` DECIMAL(12,2) DEFAULT 0,
    `TotalCost` DECIMAL(12,2) DEFAULT 0,
    `TotalProfit` DECIMAL(12,2) DEFAULT 0,
    `Remark` VARCHAR(500),
    `Status` VARCHAR(20) DEFAULT 'pending',
    `Creator` VARCHAR(100),
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `sales_order_detail` (
    `DetailID` INT AUTO_INCREMENT PRIMARY KEY,
    `SoID` INT NOT NULL,
    `ProductID` INT,
    `ProductName` VARCHAR(200),
    `Unit` VARCHAR(20),
    `CustomerProductCode` VARCHAR(50),
    `CustomerProductName` VARCHAR(200),
    `OurProductCode` VARCHAR(50),
    `OurProductName` VARCHAR(200),
    `Quantity` DECIMAL(12,2) DEFAULT 0,
    `OriginalPrice` DECIMAL(12,2) DEFAULT 0,
    `UnitPrice` DECIMAL(12,2) DEFAULT 0,
    `CostPrice` DECIMAL(12,2) DEFAULT 0,
    `Profit` DECIMAL(12,2) DEFAULT 0,
    `Amount` DECIMAL(12,2) DEFAULT 0,
    `Remark` VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS `receivable` (
    `ReceivableID` INT AUTO_INCREMENT PRIMARY KEY,
    `ReceivableNo` VARCHAR(50) NOT NULL UNIQUE,
    `CustomerID` INT,
    `SalesOrderID` INT,
    `TotalAmount` DECIMAL(12,2) DEFAULT 0,
    `ReceivedAmount` DECIMAL(12,2) DEFAULT 0,
    `PendingAmount` DECIMAL(12,2) DEFAULT 0,
    `DueDate` DATETIME,
    `Status` VARCHAR(20) DEFAULT 'unpaid',
    `Remark` VARCHAR(500),
    `PaymentMethod` VARCHAR(50),
    `LastPaymentDate` DATETIME,
    `Creator` VARCHAR(100),
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `payable` (
    `PayableID` INT AUTO_INCREMENT PRIMARY KEY,
    `PayableNo` VARCHAR(50) NOT NULL UNIQUE,
    `SupplierID` INT,
    `PurchaseOrderID` INT,
    `TotalAmount` DECIMAL(12,2) DEFAULT 0,
    `PaidAmount` DECIMAL(12,2) DEFAULT 0,
    `PendingAmount` DECIMAL(12,2) DEFAULT 0,
    `DueDate` DATETIME,
    `Status` VARCHAR(20) DEFAULT 'unpaid',
    `Remark` VARCHAR(500),
    `PaymentMethod` VARCHAR(50),
    `LastPaymentDate` DATETIME,
    `Creator` VARCHAR(100),
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `expense` (
    `ExpenseID` INT AUTO_INCREMENT PRIMARY KEY,
    `ExpenseNo` VARCHAR(50) NOT NULL UNIQUE,
    `ApplicantID` INT,
    `ApplicantName` VARCHAR(100),
    `Department` VARCHAR(100),
    `Amount` DECIMAL(12,2) DEFAULT 0,
    `Category` VARCHAR(50),
    `Description` VARCHAR(500),
    `Status` VARCHAR(20) DEFAULT 'pending',
    `ApproverID` INT,
    `ApproverName` VARCHAR(100),
    `ApproveDate` DATETIME,
    `ApproveRemark` VARCHAR(500),
    `Remark` VARCHAR(500),
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `purchase_order` (
    `POID` INT AUTO_INCREMENT PRIMARY KEY,
    `PONo` VARCHAR(50) NOT NULL UNIQUE,
    `SupplierID` INT,
    `OrderDate` DATETIME,
    `RequestedDate` DATETIME,
    `ReceivedDate` DATETIME,
    `DeliveryDate` DATETIME,
    `TotalQuantity` DECIMAL(12,2) DEFAULT 0,
    `ReceivedQuantity` DECIMAL(12,2) DEFAULT 0,
    `RemainingQuantity` DECIMAL(12,2) DEFAULT 0,
    `TotalAmount` DECIMAL(12,2) DEFAULT 0,
    `Remark` VARCHAR(500),
    `Status` VARCHAR(20) DEFAULT 'pending',
    `Creator` VARCHAR(100),
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `purchase_order_detail` (
    `DetailID` INT AUTO_INCREMENT PRIMARY KEY,
    `POID` INT NOT NULL,
    `MaterialID` INT,
    `MaterialName` VARCHAR(200),
    `Unit` VARCHAR(20),
    `SupplierProductCode` VARCHAR(50),
    `SupplierProductName` VARCHAR(200),
    `OurMaterialCode` VARCHAR(50),
    `OurMaterialName` VARCHAR(200),
    `Quantity` DECIMAL(12,2) DEFAULT 0,
    `ReceivedQuantity` DECIMAL(12,2) DEFAULT 0,
    `RemainingQuantity` DECIMAL(12,2) DEFAULT 0,
    `UnitPrice` DECIMAL(12,2) DEFAULT 0,
    `Amount` DECIMAL(12,2) DEFAULT 0,
    `Remark` VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS `material` (
    `MaterialID` INT AUTO_INCREMENT PRIMARY KEY,
    `MaterialCode` VARCHAR(50) NOT NULL UNIQUE,
    `MaterialName` VARCHAR(200) NOT NULL,
    `Category` VARCHAR(50),
    `Unit` VARCHAR(20),
    `Spec` VARCHAR(200),
    `Cost` DECIMAL(12,2) DEFAULT 0,
    `Status` INT DEFAULT 1,
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);

CREATE TABLE IF NOT EXISTS `material_supplier` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `MaterialID` INT NOT NULL,
    `SupplierID` INT NOT NULL,
    `SupplierProductCode` VARCHAR(50),
    `SupplierProductName` VARCHAR(200),
    `PurchasePrice` DECIMAL(12,2) DEFAULT 0,
    `Status` INT DEFAULT 1,
    `CreateDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME
);
