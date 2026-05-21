# 数据字典与代码实现对齐检查清单

## 阶段一：数据库迁移

- [x] 客户表 (customer) 修改正确
  - [x] 添加了 customerShortName 字段
  - [x] 添加了 province 字段
  - [x] 添加了 city 字段
  - [x] 添加了 deliveryDays 字段
  - [x] 添加了 paymentDays 字段
  - [x] 添加了 creditLimit 字段
  - [x] 添加了 usedCredit 字段

- [x] 报价单明细表 (quotation_detail) 修改正确
  - [x] 添加了 customerProductCode 字段
  - [x] 添加了 customerProductName 字段
  - [x] 添加了 ourProductCode 字段
  - [x] 添加了 ourProductName 字段
  - [x] 添加了 originalPrice 字段
  - [x] 添加了 costPrice 字段
  - [x] 添加了 attachment 字段
  - [x] 添加了 remark 字段

- [x] 销售订单表 (sales_order) 修改正确
  - [x] 添加了 totalQuantity 字段
  - [x] 添加了 totalCost 字段
  - [x] 添加了 totalProfit 字段
  - [x] 添加了 remark 字段

- [x] 销售订单明细表 (sales_order_detail) 修改正确
  - [x] 添加了 customerProductCode 字段
  - [x] 添加了 customerProductName 字段
  - [x] 添加了 ourProductCode 字段
  - [x] 添加了 ourProductName 字段
  - [x] 添加了 originalPrice 字段
  - [x] 添加了 costPrice 字段
  - [x] 添加了 profit 字段
  - [x] 添加了 remark 字段

- [x] 采购订单表 (purchase_order) 修改正确
  - [x] 添加了 requestedDate 字段
  - [x] 添加了 receivedDate 字段
  - [x] 添加了 totalQuantity 字段
  - [x] 添加了 receivedQuantity 字段
  - [x] 添加了 remainingQuantity 字段
  - [x] 添加了 remark 字段

- [x] 采购订单明细表 (purchase_order_detail) 修改正确
  - [x] productID 已改为 materialID
  - [x] 添加了 supplierProductCode 字段
  - [x] 添加了 supplierProductName 字段
  - [x] 添加了 ourMaterialCode 字段
  - [x] 添加了 ourMaterialName 字段
  - [x] 添加了 receivedQuantity 字段
  - [x] 添加了 remainingQuantity 字段
  - [x] 添加了 remark 字段

- [x] 原材料表 (material) 创建正确
  - [x] MaterialID 主键定义正确
  - [x] MaterialCode 唯一索引定义正确
  - [x] 所有字段类型和注释正确
  - [x] 所有索引定义正确

- [x] 原材料供应商关联表 (material_supplier) 存在
  - [x] 表结构与数据字典一致

---

## 阶段二：后端实体类

- [x] Customer.java 实体类修改正确
  - [x] 添加了 customerShortName 字段
  - [x] 添加了 province 字段
  - [x] 添加了 city 字段
  - [x] 添加了 deliveryDays 字段
  - [x] 添加了 paymentDays 字段
  - [x] 添加了 creditLimit 字段
  - [x] 添加了 usedCredit 字段
  - [x] 所有字段注释完整

- [x] QuotationDetail.java 实体类修改正确
  - [x] 添加了 customerProductCode 字段
  - [x] 添加了 customerProductName 字段
  - [x] 添加了 ourProductCode 字段
  - [x] 添加了 ourProductName 字段
  - [x] 添加了 originalPrice 字段
  - [x] 添加了 costPrice 字段
  - [x] 添加了 attachment 字段
  - [x] 添加了 remark 字段
  - [x] 所有字段注释完整

- [x] SalesOrder.java 实体类修改正确
  - [x] 添加了 totalQuantity 字段
  - [x] 添加了 totalCost 字段
  - [x] 添加了 totalProfit 字段
  - [x] 添加了 remark 字段
  - [x] 所有字段注释完整

- [x] SalesOrderDetail.java 实体类修改正确
  - [x] 添加了 customerProductCode 字段
  - [x] 添加了 customerProductName 字段
  - [x] 添加了 ourProductCode 字段
  - [x] 添加了 ourProductName 字段
  - [x] 添加了 originalPrice 字段
  - [x] 添加了 costPrice 字段
  - [x] 添加了 profit 字段
  - [x] 添加了 remark 字段
  - [x] 所有字段注释完整

- [x] PurchaseOrder.java 实体类修改正确
  - [x] 添加了 requestedDate 字段
  - [x] 添加了 receivedDate 字段
  - [x] 添加了 totalQuantity 字段
  - [x] 添加了 receivedQuantity 字段
  - [x] 添加了 remainingQuantity 字段
  - [x] 添加了 remark 字段
  - [x] 所有字段注释完整

- [x] PurchaseOrderDetail.java 实体类修改正确
  - [x] productID 已改为 materialID
  - [x] 添加了 supplierProductCode 字段
  - [x] 添加了 supplierProductName 字段
  - [x] 添加了 ourMaterialCode 字段
  - [x] 添加了 ourMaterialName 字段
  - [x] 添加了 receivedQuantity 字段
  - [x] 添加了 remainingQuantity 字段
  - [x] 添加了 remark 字段
  - [x] 所有字段注释完整

- [x] Material.java 实体类创建正确
  - [x] 类定义完整
  - [x] 所有字段定义正确
  - [x] 表名注解正确
  - [x] 主键注解正确
  - [x] 所有字段注释完整

- [x] MaterialSupplier.java 实体类存在
  - [x] 类定义与数据字典一致

- [ ] 后端编译通过
  - [ ] mvn clean compile 成功
  - [ ] 无编译警告
  - [ ] 所有类型定义正确

---

## 阶段三：前端页面

- [ ] 客户管理页面修改正确
  - [ ] 列表显示所有新字段
  - [ ] 表单包含所有新字段
  - [ ] 地区下拉选择正常工作
  - [ ] 信用额度计算正确

- [ ] 报价单页面修改正确
  - [ ] 报价明细显示客户产品列
  - [ ] 报价明细显示价格相关列
  - [ ] 附件上传功能正常
  - [ ] 状态选项值正确 (unquoted/quoted/confirmed)

- [ ] 销售订单页面修改正确
  - [ ] 列表显示统计列
  - [ ] 明细显示客户产品列
  - [ ] 明细显示成本利润列
  - [ ] 状态选项值正确

- [ ] 采购订单页面修改正确
  - [ ] 列表显示入库进度列
  - [ ] 明细显示供应商产品列
  - [ ] 明细显示入库数量列
  - [ ] 状态选项值正确 (pending/approved/stocked/cancelled)

- [ ] 原材料管理页面创建正确
  - [ ] 原材料列表页面完整
  - [ ] 原材料编辑表单完整
  - [ ] 供应商关联管理功能正常

- [x] 前端类型定义更新正确
  - [x] Customer 类型包含所有字段
  - [x] QuotationDetail 类型包含所有字段
  - [x] SalesOrder 类型包含所有字段
  - [x] SalesOrderDetail 类型包含所有字段
  - [x] PurchaseOrder 类型包含所有字段
  - [x] PurchaseOrderDetail 类型包含所有字段
  - [x] Material 类型定义完整

- [ ] 前端 API 定义更新正确
  - [ ] 客户管理 API 完整
  - [ ] 报价单 API 完整
  - [ ] 销售订单 API 完整
  - [ ] 采购订单 API 完整
  - [ ] 原材料管理 API 完整

- [x] 前端编译通过
  - [x] npm run build 成功
  - [x] 无 TypeScript 类型错误
  - [x] 无编译错误

---

## 阶段四：测试验证

- [ ] 数据库测试通过
  - [ ] 表结构验证正确
  - [ ] 数据迁移完整
  - [ ] 索引正常工作
  - [ ] 外键关系正确

- [ ] 后端 API 测试通过
  - [ ] 客户管理 API 测试通过
  - [ ] 报价单 API 测试通过
  - [ ] 销售订单 API 测试通过
  - [ ] 采购订单 API 测试通过
  - [ ] 原材料管理 API 测试通过

- [ ] 前端功能测试通过
  - [ ] 客户管理页面测试通过
  - [ ] 报价单页面测试通过
  - [ ] 销售订单页面测试通过
  - [ ] 采购订单页面测试通过
  - [ ] 原材料管理页面测试通过

- [ ] 数据一致性验证通过
  - [ ] 前后端字段一致
  - [ ] 数据库与实体类一致
  - [ ] 数据字典与实现一致
  - [ ] 状态枚举值一致

- [ ] 集成测试通过
  - [ ] 端到端业务流程测试通过
  - [ ] 性能测试通过
  - [ ] 安全测试通过

---

## 阶段五：部署上线

- [ ] 数据库迁移脚本准备完成
  - [ ] 迁移脚本编写完成
  - [ ] 回滚方案准备完成
  - [ ] 测试环境验证通过

- [ ] 后端部署完成
  - [ ] 测试环境部署成功
  - [ ] 生产环境部署成功
  - [ ] 服务启动正常

- [ ] 前端部署完成
  - [ ] 测试环境部署成功
  - [ ] 生产环境部署成功
  - [ ] Cloudflare Pages 部署成功

- [ ] 文档更新完成
  - [ ] 数据字典文档已更新
  - [ ] API 文档已更新
  - [ ] 用户手册已更新

---

## 最终验收

- [ ] 所有数据库表结构与数据字典完全一致
- [ ] 所有后端实体类与数据字典完全一致
- [ ] 所有前端类型定义与数据字典完全一致
- [ ] 所有状态枚举值与数据字典完全一致
- [ ] 所有功能页面正常工作
- [ ] 数据一致性验证通过
- [ ] 集成测试全部通过
- [ ] 部署上线成功
- [ ] 文档更新完成
