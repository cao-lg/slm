import { type Page } from '@playwright/test';

// 完整示例账套数据
// 适用于制造企业的完整业务数据集
export const DEMO_ACCOUNT_DATA = {
  version: '1.0.0',
  created: '2025-05-24',
  name: '示例企业账套',
  description: '制造企业完整业务数据示例，包含销售、采购、生产、财务等模块',

  customers: [
    {
      customerID: 1,
      customerCode: 'KH202505200001',
      customerName: '北京科技有限公司',
      contact: '张三',
      phone: '13800138001',
      fax: '010-66666666',
      email: 'zhang@tech.com',
      address: '北京市朝阳区望京SOHO',
      taxNumber: '110105123456789',
      bankAccount: '工行北京望京支行 622202111100001111',
      creditLimit: 100000,
      currentBalance: 0,
      status: 1,
      remark: '重点客户'
    },
    {
      customerID: 2,
      customerCode: 'KH202505200002',
      customerName: '上海商贸集团',
      contact: '李四',
      phone: '13800138002',
      fax: '021-77777777',
      email: 'li@trade.com',
      address: '上海市浦东新区陆家嘴金融中心',
      taxNumber: '310115987654321',
      bankAccount: '上海银行浦东分行 622848222200002222',
      creditLimit: 200000,
      currentBalance: 0,
      status: 1,
      remark: '长期合作伙伴'
    },
    {
      customerID: 3,
      customerCode: 'KH202505200003',
      customerName: '广州电子科技',
      contact: '王五',
      phone: '13800138003',
      fax: '020-88888888',
      email: 'wang@electronics.com',
      address: '广州市天河区珠江新城',
      taxNumber: '440106112233445',
      bankAccount: '建行广州天河支行 621700333300003333',
      creditLimit: 150000,
      currentBalance: 0,
      status: 1,
      remark: '新客户'
    },
    {
      customerID: 4,
      customerCode: 'KH202505200004',
      customerName: '深圳智能制造',
      contact: '赵六',
      phone: '13900139004',
      fax: '0755-99999999',
      email: 'zhao@szim.com',
      address: '深圳市南山区科技园',
      taxNumber: '440305556677889',
      bankAccount: '招商银行深圳分行 622588444400004444',
      creditLimit: 300000,
      currentBalance: 0,
      status: 1,
      remark: '战略合作伙伴'
    }
  ],

  products: [
    {
      productID: 1,
      productCode: 'CP202505200001',
      productName: 'A型智能传感器',
      category: '传感器',
      unit: '个',
      spec: '精度±0.01mm，输出4-20mA',
      price: 280.00,
      cost: 120.00,
      stockQuantity: 500,
      safetyStock: 100,
      status: 1,
      description: '高精度工业级传感器'
    },
    {
      productID: 2,
      productCode: 'CP202505200002',
      productName: 'B型控制模块',
      category: '控制器',
      unit: '套',
      spec: '可编程逻辑控制器，24路输入输出',
      price: 1200.00,
      cost: 550.00,
      stockQuantity: 200,
      safetyStock: 50,
      status: 1,
      description: '核心控制模块'
    },
    {
      productID: 3,
      productCode: 'CP202505200003',
      productName: 'C型连接配件',
      category: '配件',
      unit: '件',
      spec: '标准工业接头套件',
      price: 45.00,
      cost: 18.00,
      stockQuantity: 2000,
      safetyStock: 500,
      status: 1,
      description: '标准连接配件'
    },
    {
      productID: 4,
      productCode: 'CP202505200004',
      productName: 'D型工业电源',
      category: '电源',
      unit: '台',
      spec: '24V DC 10A 开关电源',
      price: 320.00,
      cost: 150.00,
      stockQuantity: 300,
      safetyStock: 80,
      status: 1,
      description: '稳定工业电源'
    },
    {
      productID: 5,
      productCode: 'CP202505200005',
      productName: 'E型通信模块',
      category: '通信',
      unit: '个',
      spec: 'Modbus-RTU/RS485通信模块',
      price: 180.00,
      cost: 75.00,
      stockQuantity: 400,
      safetyStock: 100,
      status: 1,
      description: '工业通信模块'
    }
  ],

  suppliers: [
    {
      supplierID: 1,
      supplierCode: 'HS01103',
      supplierName: '果山环保科技',
      contact: '陈经理',
      phone: '13900139001',
      fax: '0755-66666666',
      email: 'chen@material.com',
      address: '深圳市南山区西丽工业区',
      taxNumber: '440305123456789',
      bankAccount: '农行深圳西丽支行 622848111100001111',
      creditLimit: 150000,
      currentBalance: 0,
      status: 1,
      remark: '主要材料供应商'
    },
    {
      supplierID: 2,
      supplierCode: 'HS01105',
      supplierName: '德堡新材料',
      contact: '刘经理',
      phone: '13900139002',
      fax: '0571-77777777',
      email: 'liu@chemical.com',
      address: '杭州市西湖区留下工业区',
      taxNumber: '330106987654321',
      bankAccount: '建行杭州西湖支行 621700222200002222',
      creditLimit: 200000,
      currentBalance: 0,
      status: 1,
      remark: '化工材料供应商'
    },
    {
      supplierID: 3,
      supplierCode: 'GYS202505200003',
      supplierName: '深圳精密电子',
      contact: '周经理',
      phone: '13900139003',
      fax: '0755-88888888',
      email: 'zhou@precision.com',
      address: '深圳市福田区华强北',
      taxNumber: '440304112233445',
      bankAccount: '平安银行深圳分行 622538333300003333',
      creditLimit: 250000,
      currentBalance: 0,
      status: 1,
      remark: '电子元件供应商'
    },
    {
      supplierID: 4,
      supplierCode: 'GYS202505200004',
      supplierName: '上海机械制造',
      contact: '吴经理',
      phone: '13900139004',
      fax: '021-99999999',
      email: 'wu@shmech.com',
      address: '上海市嘉定区安亭汽车城',
      taxNumber: '310114556677889',
      bankAccount: '交行上海嘉定支行 622262444400004444',
      creditLimit: 300000,
      currentBalance: 0,
      status: 1,
      remark: '机械部件供应商'
    }
  ],

  materials: [
    {
      materialID: 1,
      materialCode: 'YL202505200001',
      materialName: 'PCB电路板',
      spec: 'FR-4 双层板',
      unit: '块',
      category: '电子元件',
      stockQuantity: 1000,
      unitPrice: 25.0,
      safetyStock: 200,
      status: 1,
      remark: '主电路板'
    },
    {
      materialID: 2,
      materialCode: 'YL202505200002',
      materialName: '集成电路芯片',
      spec: 'STM32F103C8T6',
      unit: '片',
      category: '电子元件',
      stockQuantity: 800,
      unitPrice: 45.0,
      safetyStock: 150,
      status: 1,
      remark: '主控芯片'
    },
    {
      materialID: 3,
      materialCode: 'YL202505200003',
      materialName: '电阻电容包',
      spec: '0402封装常用规格',
      unit: '包',
      category: '电子元件',
      stockQuantity: 500,
      unitPrice: 15.0,
      safetyStock: 100,
      status: 1,
      remark: '通用被动元件'
    },
    {
      materialID: 4,
      materialCode: 'YL202505200004',
      materialName: '塑料外壳',
      spec: 'ABS工程塑料',
      unit: '个',
      category: '结构件',
      stockQuantity: 1200,
      unitPrice: 8.0,
      safetyStock: 300,
      status: 1,
      remark: '产品外壳'
    },
    {
      materialID: 5,
      materialCode: 'YL202505200005',
      materialName: '连接线束',
      spec: '2.54mm间距，20cm',
      unit: '套',
      category: '线束',
      stockQuantity: 600,
      unitPrice: 5.0,
      safetyStock: 150,
      status: 1,
      remark: '内部连接线'
    },
    {
      materialID: 6,
      materialCode: 'YL202505200006',
      materialName: '金属外壳',
      spec: '铝合金CNC加工',
      unit: '个',
      category: '结构件',
      stockQuantity: 400,
      unitPrice: 35.0,
      safetyStock: 100,
      status: 1,
      remark: '高端产品外壳'
    },
    {
      materialID: 7,
      materialCode: 'YL202505200007',
      materialName: '包装材料',
      spec: '彩盒+说明书+包装',
      unit: '套',
      category: '包装',
      stockQuantity: 1500,
      unitPrice: 3.0,
      safetyStock: 500,
      status: 1,
      remark: '产品包装'
    }
  ],

  quotations: [
    {
      quotationID: 1,
      quotationNo: 'BJ202505200001',
      customerID: 1,
      customerName: '北京科技有限公司',
      quotationDate: '2025-05-20',
      validUntil: '2025-06-20',
      totalAmount: 28000.00,
      status: 'accepted',
      creator: '陈立国',
      remark: '5月份订单'
    },
    {
      quotationID: 2,
      quotationNo: 'BJ202505200002',
      customerID: 2,
      customerName: '上海商贸集团',
      quotationDate: '2025-05-18',
      validUntil: '2025-06-18',
      totalAmount: 48000.00,
      status: 'pending',
      creator: '陈立国',
      remark: '等待确认'
    },
    {
      quotationID: 3,
      quotationNo: 'BJ202505200003',
      customerID: 3,
      customerName: '广州电子科技',
      quotationDate: '2025-05-15',
      validUntil: '2025-06-15',
      totalAmount: 72000.00,
      status: 'rejected',
      creator: '陈立国',
      remark: '客户已选择其他供应商'
    },
    {
      quotationID: 4,
      quotationNo: 'BJ202505200004',
      customerID: 4,
      customerName: '深圳智能制造',
      quotationDate: '2025-05-22',
      validUntil: '2025-06-22',
      totalAmount: 120000.00,
      status: 'pending',
      creator: '陈立国',
      remark: '大客户报价'
    }
  ],

  salesOrders: [
    {
      orderID: 1,
      orderNo: 'XS202505200001',
      customerID: 1,
      customerName: '北京科技有限公司',
      orderDate: '2025-05-20',
      deliveryDate: '2025-05-30',
      totalAmount: 28000.00,
      status: 'shipped',
      creator: '陈立国',
      remark: '从报价单BJ202505200001转换'
    },
    {
      orderID: 2,
      orderNo: 'XS202505200002',
      customerID: 2,
      customerName: '上海商贸集团',
      orderDate: '2025-05-18',
      deliveryDate: '2025-05-28',
      totalAmount: 48000.00,
      status: 'producing',
      creator: '陈立国',
      remark: '生产中'
    },
    {
      orderID: 3,
      orderNo: 'XS202505200003',
      customerID: 4,
      customerName: '深圳智能制造',
      orderDate: '2025-05-10',
      deliveryDate: '2025-05-25',
      totalAmount: 84000.00,
      status: 'completed',
      creator: '陈立国',
      remark: '已完成'
    },
    {
      orderID: 4,
      orderNo: 'XS202505200004',
      customerID: 3,
      customerName: '广州电子科技',
      orderDate: '2025-05-24',
      deliveryDate: '2025-06-05',
      totalAmount: 36000.00,
      status: 'pending',
      creator: '陈立国',
      remark: '新订单'
    }
  ],

  purchaseOrders: [
    {
      poID: 1,
      poNo: 'CG202505200001',
      supplierID: 3,
      supplierName: '深圳精密电子',
      orderDate: '2025-05-18',
      deliveryDate: '2025-05-28',
      totalAmount: 25000.00,
      status: 'received',
      creator: '陈立国',
      remark: 'PCB和芯片'
    },
    {
      poID: 2,
      poNo: 'CG202505200002',
      supplierID: 4,
      supplierName: '上海机械制造',
      orderDate: '2025-05-20',
      deliveryDate: '2025-05-30',
      totalAmount: 18000.00,
      status: 'approved',
      creator: '陈立国',
      remark: '结构件'
    },
    {
      poID: 3,
      poNo: 'CG202505200003',
      supplierID: 1,
      supplierName: '果山环保科技',
      orderDate: '2025-05-22',
      deliveryDate: '2025-06-01',
      totalAmount: 8000.00,
      status: 'pending',
      creator: '陈立国',
      remark: '包装材料'
    }
  ],

  productionPlans: [
    {
      planId: 1,
      planNo: 'SC202505200001',
      productID: 1,
      productName: 'A型智能传感器',
      plannedQuantity: 100,
      completedQuantity: 80,
      startDate: '2025-05-20',
      endDate: '2025-05-30',
      responsible: '张工',
      status: 'producing',
      remark: '北京科技订单',
      createDate: '2025-05-20 09:00:00',
      creator: '陈立国',
      recipeId: 1,
      recipeName: 'A型传感器标准配方'
    },
    {
      planId: 2,
      planNo: 'SC202505200002',
      productID: 2,
      productName: 'B型控制模块',
      plannedQuantity: 40,
      completedQuantity: 0,
      startDate: '2025-05-22',
      endDate: '2025-06-02',
      responsible: '李工',
      status: 'pending',
      remark: '上海商贸订单',
      createDate: '2025-05-18 14:30:00',
      creator: '陈立国',
      recipeId: 2,
      recipeName: 'B型模块标准配方'
    },
    {
      planId: 3,
      planNo: 'SC202505200003',
      productID: 3,
      productName: 'C型连接配件',
      plannedQuantity: 500,
      completedQuantity: 500,
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      responsible: '王工',
      status: 'completed',
      remark: '库存备货',
      createDate: '2025-05-15 08:00:00',
      creator: '陈立国',
      recipeId: 3,
      recipeName: 'C型配件标准配方'
    },
    {
      planId: 4,
      planNo: 'SC202505200004',
      productID: 4,
      productName: 'D型工业电源',
      plannedQuantity: 200,
      completedQuantity: 200,
      startDate: '2025-05-08',
      endDate: '2025-05-18',
      responsible: '赵工',
      status: 'completed',
      remark: '深圳智造订单',
      createDate: '2025-05-08 10:00:00',
      creator: '陈立国',
      recipeId: 4,
      recipeName: 'D型电源标准配方'
    }
  ],

  receivables: [
    {
      receivableID: 1,
      orderID: 3,
      orderNo: 'XS202505200003',
      customerID: 4,
      customerName: '深圳智能制造',
      totalAmount: 84000.00,
      receivedAmount: 84000.00,
      pendingAmount: 0.00,
      status: 'paid',
      createDate: '2025-05-10',
      dueDate: '2025-05-25'
    },
    {
      receivableID: 2,
      orderID: 1,
      orderNo: 'XS202505200001',
      customerID: 1,
      customerName: '北京科技有限公司',
      totalAmount: 28000.00,
      receivedAmount: 14000.00,
      pendingAmount: 14000.00,
      status: 'partial',
      createDate: '2025-05-20',
      dueDate: '2025-06-20'
    },
    {
      receivableID: 3,
      orderID: 2,
      orderNo: 'XS202505200002',
      customerID: 2,
      customerName: '上海商贸集团',
      totalAmount: 48000.00,
      receivedAmount: 0.00,
      pendingAmount: 48000.00,
      status: 'unpaid',
      createDate: '2025-05-18',
      dueDate: '2025-06-18'
    }
  ],

  payables: [
    {
      payableID: 1,
      poID: 1,
      poNo: 'CG202505200001',
      supplierID: 3,
      supplierName: '深圳精密电子',
      totalAmount: 25000.00,
      paidAmount: 25000.00,
      pendingAmount: 0.00,
      status: 'paid',
      createDate: '2025-05-18',
      dueDate: '2025-05-28'
    },
    {
      payableID: 2,
      poID: 2,
      poNo: 'CG202505200002',
      supplierID: 4,
      supplierName: '上海机械制造',
      totalAmount: 18000.00,
      paidAmount: 0.00,
      pendingAmount: 18000.00,
      status: 'unpaid',
      createDate: '2025-05-20',
      dueDate: '2025-06-20'
    },
    {
      payableID: 3,
      poID: 3,
      poNo: 'CG202505200003',
      supplierID: 1,
      supplierName: '果山环保科技',
      totalAmount: 8000.00,
      paidAmount: 4000.00,
      pendingAmount: 4000.00,
      status: 'partial',
      createDate: '2025-05-22',
      dueDate: '2025-06-22'
    }
  ],

  users: [
    { id: 1, userName: 'admin', realName: '管理员', role: 'admin', department: '管理部', position: '系统管理员', email: 'admin@example.com', phone: '13800138001', status: 1, createDate: '2024-01-01 00:00:00', lastLoginDate: '2025-05-20 10:30:00' },
    { id: 2, userName: 'manager', realName: '陈立国', role: 'manager', department: '销售部', position: '销售经理', email: 'manager@example.com', phone: '13800138002', status: 1, createDate: '2024-01-05 00:00:00', lastLoginDate: '2025-05-20 09:15:00' },
    { id: 3, userName: 'user01', realName: '张三', role: 'user', department: '销售部', position: '销售员', email: 'user01@example.com', phone: '13800138003', status: 1, createDate: '2024-01-10 00:00:00', lastLoginDate: '2025-05-19 18:20:00' },
    { id: 4, userName: 'user02', realName: '李四', role: 'user', department: '采购部', position: '采购员', email: 'user02@example.com', phone: '13800138004', status: 1, createDate: '2024-01-12 00:00:00', lastLoginDate: '2025-05-20 08:45:00' },
    { id: 5, userName: 'user03', realName: '王五', role: 'user', department: '生产部', position: '生产主管', email: 'user03@example.com', phone: '13800138005', status: 0, createDate: '2024-01-15 00:00:00', lastLoginDate: '2025-05-18 17:30:00' }
  ],

  messages: [
    { messageID: 1, title: '系统升级通知', content: '系统将于今晚10点进行升级维护，预计持续2小时。', messageType: 1, senderID: 1, senderName: '管理员', isAll: 1, isRead: 0, publishDate: '2025-05-20 08:00:00', priority: 2, status: 1, createDate: '2025-05-20 08:00:00' },
    { messageID: 2, title: '销售订单待处理', content: '有一笔新的销售订单需要您审批，请及时处理。', messageType: 2, senderID: 3, senderName: '张三', receiverIDs: '2', receiverNames: '陈立国', isAll: 0, isRead: 1, publishDate: '2025-05-19 15:30:00', priority: 1, status: 1, createDate: '2025-05-19 15:30:00', readDate: '2025-05-19 16:00:00' },
    { messageID: 3, title: '月度会议通知', content: '请各部门经理于本月25日到会议室参加月度总结会议。', messageType: 3, senderID: 1, senderName: '管理员', isAll: 1, isRead: 1, publishDate: '2025-05-18 10:00:00', priority: 0, status: 1, createDate: '2025-05-18 10:00:00', readDate: '2025-05-18 11:00:00' },
    { messageID: 4, title: '采购入库提醒', content: '有一批原材料已到货，请仓库人员及时入库。', messageType: 2, senderID: 4, senderName: '李四', receiverIDs: '1', receiverNames: '管理员', isAll: 0, isRead: 0, publishDate: '2025-05-20 09:00:00', priority: 1, status: 1, createDate: '2025-05-20 09:00:00' }
  ],

  operationLogs: [
    { logID: 1, module: 'user', operationType: '登录', operationDesc: '用户登录系统', operatorID: 1, operatorName: '管理员', requestMethod: 'POST', requestUrl: '/api/auth/login', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', executionTime: 120, isSuccess: 1, operateDate: '2025-05-20 10:30:00' },
    { logID: 2, module: 'order', operationType: '新增', operationDesc: '创建销售订单 XS202505200001', operatorID: 3, operatorName: '张三', requestMethod: 'POST', requestUrl: '/api/sales/order', requestParams: '{"customerID":1,"totalAmount":28000}', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0', executionTime: 85, isSuccess: 1, operateDate: '2025-05-20 10:25:00' },
    { logID: 3, module: 'warehouse', operationType: '编辑', operationDesc: '更新库存数量', operatorID: 1, operatorName: '管理员', requestMethod: 'PUT', requestUrl: '/api/warehouse/inventory', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', executionTime: 65, isSuccess: 1, operateDate: '2025-05-20 09:45:00' },
    { logID: 4, module: 'product', operationType: '新增', operationDesc: '添加新产品', operatorID: 1, operatorName: '管理员', requestMethod: 'POST', requestUrl: '/api/product', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', executionTime: 95, isSuccess: 1, operateDate: '2025-05-19 16:30:00' },
    { logID: 5, module: 'system', operationType: '编辑', operationDesc: '修改系统配置', operatorID: 1, operatorName: '管理员', requestMethod: 'PUT', requestUrl: '/api/system/config', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', executionTime: 50, isSuccess: 1, operateDate: '2025-05-19 14:20:00' },
    { logID: 6, module: 'customer', operationType: '删除', operationDesc: '删除客户信息', operatorID: 2, operatorName: '陈立国', requestMethod: 'DELETE', requestUrl: '/api/sales/customer/5', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0', executionTime: 30, isSuccess: 0, errorMessage: '该客户有关联订单，无法删除', operateDate: '2025-05-19 11:15:00' },
    { logID: 7, module: 'finance', operationType: '新增', operationDesc: '创建收款记录', operatorID: 2, operatorName: '陈立国', requestMethod: 'POST', requestUrl: '/api/finance/receivable', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0', executionTime: 78, isSuccess: 1, operateDate: '2025-05-18 15:40:00' },
    { logID: 8, module: 'user', operationType: '登出', operationDesc: '用户退出系统', operatorID: 3, operatorName: '张三', requestMethod: 'POST', requestUrl: '/api/auth/logout', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0', executionTime: 15, isSuccess: 1, operateDate: '2025-05-18 18:20:00' }
  ],

  systemConfigs: [
    { configID: 1, configKey: 'themeColor', configName: '主题颜色', configValue: '#409eff', configType: 'theme', description: '系统主题颜色', sortOrder: 1, status: 1 },
    { configID: 2, configKey: 'navMode', configName: '导航模式', configValue: 'vertical', configType: 'theme', description: '导航菜单模式', sortOrder: 2, status: 1 },
    { configID: 3, configKey: 'navCollapse', configName: '导航默认折叠', configValue: 'true', configType: 'theme', description: '侧边导航是否默认折叠', sortOrder: 3, status: 1 },
    { configID: 4, configKey: 'showLogo', configName: '显示Logo', configValue: 'true', configType: 'theme', description: '是否显示系统Logo', sortOrder: 4, status: 1 },
    { configID: 5, configKey: 'pageSize', configName: '默认分页大小', configValue: '20', configType: 'display', description: '列表默认每页显示条数', sortOrder: 5, status: 1 },
    { configID: 6, configKey: 'language', configName: '系统语言', configValue: 'zh-CN', configType: 'display', description: '系统界面语言', sortOrder: 6, status: 1 },
    { configID: 7, configKey: 'dateFormat', configName: '日期格式', configValue: 'YYYY-MM-DD HH:mm:ss', configType: 'display', description: '日期时间显示格式', sortOrder: 7, status: 1 }
  ],

  warehouseDeliveries: [
    {
      deliveryID: 1,
      deliveryNo: 'FH202505200001',
      soID: 3,
      orderNo: 'XS202505200003',
      customerID: 4,
      customerName: '深圳智能制造',
      deliveryDate: '2025-05-22',
      status: 'shipped',
      carrier: '顺丰快递',
      trackingNo: 'SF1234567890',
      totalAmount: 84000.00,
      creator: '陈立国',
      createDate: '2025-05-22 09:00:00',
      remark: ''
    },
    {
      deliveryID: 2,
      deliveryNo: 'FH202505200002',
      soID: 1,
      orderNo: 'XS202505200001',
      customerID: 1,
      customerName: '北京科技有限公司',
      deliveryDate: '2025-05-30',
      status: 'pending',
      carrier: '',
      trackingNo: '',
      totalAmount: 28000.00,
      creator: '陈立国',
      createDate: '2025-05-25 11:00:00',
      remark: '等待发货'
    }
  ],

  warehousePicks: [
    {
      pickID: 1,
      pickNo: 'LL202505200001',
      productionPlanID: 1,
      planNo: 'SC202505200001',
      warehouseID: 3,
      warehouseName: 'KCC-材料仓',
      pickDate: '2025-05-20',
      status: 'completed',
      picker: '王五',
      createDate: '2025-05-20 08:00:00',
      remark: ''
    },
    {
      pickID: 2,
      pickNo: 'LL202505200002',
      productionPlanID: 3,
      planNo: 'SC202505200003',
      warehouseID: 3,
      warehouseName: 'KCC-材料仓',
      pickDate: '2025-05-15',
      status: 'completed',
      picker: '张三',
      createDate: '2025-05-15 08:00:00',
      remark: '生产领料'
    },
    {
      pickID: 3,
      pickNo: 'LL202505200003',
      productionPlanID: 2,
      planNo: 'SC202505200002',
      warehouseID: 3,
      warehouseName: 'KCC-材料仓',
      pickDate: '2025-05-22',
      status: 'pending',
      picker: '李四',
      createDate: '2025-05-22 08:00:00',
      remark: '等待领料'
    }
  ],

  warehouseTransfers: [
    {
      transferID: 1,
      transferNo: 'DB202505200001',
      fromWarehouseID: 3,
      fromWarehouseName: 'KCC-材料仓',
      toWarehouseID: 1,
      toWarehouseName: 'KCA-车间仓',
      transferDate: '2025-05-21',
      status: 'completed',
      creator: '陈立国',
      createDate: '2025-05-21 10:00:00',
      remark: '生产领料'
    },
    {
      transferID: 2,
      transferNo: 'DB202505200002',
      fromWarehouseID: 1,
      fromWarehouseName: 'KCA-车间仓',
      toWarehouseID: 2,
      toWarehouseName: 'KCB-成品仓',
      transferDate: '2025-05-18',
      status: 'completed',
      creator: '陈立国',
      createDate: '2025-05-18 14:00:00',
      remark: '生产完成入库'
    },
    {
      transferID: 3,
      transferNo: 'DB202505200003',
      fromWarehouseID: 3,
      fromWarehouseName: 'KCC-材料仓',
      toWarehouseID: 1,
      toWarehouseName: 'KCA-车间仓',
      transferDate: '2025-05-23',
      status: 'pending',
      creator: '陈立国',
      createDate: '2025-05-23 09:00:00',
      remark: '待审批'
    }
  ],

  warehouseReturns: [
    {
      returnID: 1,
      returnNo: 'TH202505200001',
      sourceType: 2,
      sourceID: 1,
      sourceNo: 'FH202505200001',
      customerID: 4,
      customerName: '深圳智能制造',
      warehouseID: 2,
      warehouseName: 'KCB-成品仓',
      returnDate: '2025-05-24',
      status: 'pending',
      totalAmount: 5600.00,
      creator: '陈立国',
      createDate: '2025-05-24 16:00:00',
      remark: '质量问题退货'
    }
  ],

  inventoryRecords: [
    { recordID: 1, inventoryID: 1, warehouseID: 2, productID: 1, productName: 'A型智能传感器', productCode: 'CP202505200001', unit: '个', spec: '精度±0.01mm，输出4-20mA', beforeQuantity: 500, changeQuantity: -100, afterQuantity: 400, changeType: 'out', relatedType: 'delivery', relatedID: 1, operator: '陈立国', operateDate: '2025-05-22 09:00:00', remark: '发货出库' },
    { recordID: 2, inventoryID: 2, warehouseID: 2, productID: 4, productName: 'D型工业电源', productCode: 'CP202505200004', unit: '台', spec: '24V DC 10A 开关电源', beforeQuantity: 300, changeQuantity: 200, afterQuantity: 500, changeType: 'in', relatedType: 'production', relatedID: 4, operator: '王五', operateDate: '2025-05-18 14:00:00', remark: '生产入库' },
    { recordID: 3, inventoryID: 3, warehouseID: 3, productID: 1, productName: 'PCB电路板', productCode: 'YL202505200001', unit: '块', spec: 'FR-4 双层板', beforeQuantity: 1000, changeQuantity: -200, afterQuantity: 800, changeType: 'out', relatedType: 'pick', relatedID: 1, operator: '王五', operateDate: '2025-05-20 08:00:00', remark: '生产领料' }
  ],

  expenses: [
    {
      expenseID: 1,
      expenseNo: 'EX202505200001',
      applicantID: 3,
      applicantName: '张三',
      department: '销售部',
      amount: 1500.00,
      category: '差旅费',
      description: '北京出差三天，拜访客户',
      status: 'approved',
      approverID: 2,
      approverName: '陈立国',
      approveDate: '2025-05-18',
      approveRemark: '同意报销',
      remark: '',
      createDate: '2025-05-15 10:00:00'
    },
    {
      expenseID: 2,
      expenseNo: 'EX202505200002',
      applicantID: 4,
      applicantName: '李四',
      department: '采购部',
      amount: 800.00,
      category: '招待费',
      description: '供应商招待费用',
      status: 'pending',
      approverID: null,
      approverName: null,
      approveDate: null,
      approveRemark: null,
      remark: '',
      createDate: '2025-05-19 14:00:00'
    },
    {
      expenseID: 3,
      expenseNo: 'EX202505200003',
      applicantID: 5,
      applicantName: '王五',
      department: '生产部',
      amount: 2000.00,
      category: '培训费',
      description: '技术培训课程费用',
      status: 'rejected',
      approverID: 2,
      approverName: '陈立国',
      approveDate: '2025-05-20',
      approveRemark: '培训内容与工作无关',
      remark: '',
      createDate: '2025-05-17 09:00:00'
    }
  ],

  recipes: [
    {
      recipeID: 1,
      recipeNo: 'PF202505200001',
      recipeName: 'A型智能传感器标准配方',
      productID: 1,
      productName: 'A型智能传感器',
      version: 'v1.0',
      status: 'active',
      creator: '陈立国',
      createDate: '2025-05-01 10:00:00',
      remark: '标准生产配方',
      items: [
        { itemID: 1, recipeID: 1, materialID: 1, materialName: 'PCB电路板', quantity: 1, unit: '块', remark: '主电路板' },
        { itemID: 2, recipeID: 1, materialID: 2, materialName: '集成电路芯片', quantity: 2, unit: '片', remark: '主控芯片' },
        { itemID: 3, recipeID: 1, materialID: 4, materialName: '塑料外壳', quantity: 1, unit: '个', remark: '产品外壳' },
        { itemID: 4, recipeID: 1, materialID: 5, materialName: '连接线束', quantity: 1, unit: '套', remark: '内部连接线' }
      ]
    },
    {
      recipeID: 2,
      recipeNo: 'PF202505200002',
      recipeName: 'B型控制模块标准配方',
      productID: 2,
      productName: 'B型控制模块',
      version: 'v1.0',
      status: 'active',
      creator: '陈立国',
      createDate: '2025-05-05 14:00:00',
      remark: '核心控制模块配方',
      items: [
        { itemID: 5, recipeID: 2, materialID: 1, materialName: 'PCB电路板', quantity: 1, unit: '块', remark: '主电路板' },
        { itemID: 6, recipeID: 2, materialID: 2, materialName: '集成电路芯片', quantity: 5, unit: '片', remark: '主控及周边芯片' },
        { itemID: 7, recipeID: 2, materialID: 6, materialName: '金属外壳', quantity: 1, unit: '个', remark: '高端产品外壳' }
      ]
    },
    {
      recipeID: 3,
      recipeNo: 'PF202505200003',
      recipeName: 'C型连接配件标准配方',
      productID: 3,
      productName: 'C型连接配件',
      version: 'v1.0',
      status: 'active',
      creator: '陈立国',
      createDate: '2025-05-10 09:00:00',
      remark: '连接配件配方',
      items: [
        { itemID: 8, recipeID: 3, materialID: 3, materialName: '电阻电容包', quantity: 1, unit: '包', remark: '通用被动元件' },
        { itemID: 9, recipeID: 3, materialID: 7, materialName: '包装材料', quantity: 1, unit: '套', remark: '产品包装' }
      ]
    },
    {
      recipeID: 4,
      recipeNo: 'PF202505200004',
      recipeName: 'D型工业电源标准配方',
      productID: 4,
      productName: 'D型工业电源',
      version: 'v1.0',
      status: 'active',
      creator: '陈立国',
      createDate: '2025-05-08 11:00:00',
      remark: '工业电源配方',
      items: [
        { itemID: 10, recipeID: 4, materialID: 1, materialName: 'PCB电路板', quantity: 1, unit: '块', remark: '电源电路板' },
        { itemID: 11, recipeID: 4, materialID: 4, materialName: '塑料外壳', quantity: 1, unit: '个', remark: '电源外壳' }
      ]
    }
  ],

  receipts: [],

  nextIds: {
    customerID: 5,
    productID: 6,
    supplierID: 5,
    materialID: 8,
    quotationID: 5,
    orderID: 5,
    poID: 4,
    planId: 5,
    receivableID: 4,
    payableID: 4,
    deliveryID: 3,
    pickID: 4,
    transferID: 4,
    returnID: 2,
    receiptID: 1,
    userId: 6,
    messageId: 5,
    logId: 9,
    configId: 8,
    expenseId: 4,
    recipeId: 5,
    inventoryRecordId: 4
  }
};

// 数据注入函数，通过 page.evaluate 写入 localStorage
export async function injectDemoData(page: Page): Promise<void> {
  await page.evaluate((data) => {
    localStorage.setItem('erp_demo_data', JSON.stringify(data));
  }, DEMO_ACCOUNT_DATA);
}

// 登录辅助函数
export async function login(page: Page, username: string = 'admin', password: string = 'admin123'): Promise<void> {
  await page.goto('/login');
  await page.fill('[data-testid="username-input"] input', username);
  await page.fill('[data-testid="password-input"] input', password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('**/home');
}

// 页面导航辅助函数
export async function navigateTo(page: Page, menuText: string): Promise<void> {
  await page.click(`text=${menuText}`);
}

// 测试数据清理函数
export async function clearTestData(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('erp_demo_data');
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  });
  await page.context().clearCookies();
}

// 等待页面加载完成
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}
