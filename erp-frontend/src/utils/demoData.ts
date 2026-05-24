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
      address: '杭州市西湖区留下工业园区',
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
      productId: 1,
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
      productId: 2,
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
      productId: 3,
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
      productId: 4,
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

  warehouseDeliveries: [
    {
      deliveryID: 1,
      deliveryNo: 'FH202505200001',
      orderID: 3,
      customerID: 4,
      customerName: '深圳智能制造',
      deliveryDate: '2025-05-22',
      totalAmount: 84000.00,
      status: 'confirmed',
      operator: '陈立国'
    }
  ],

  warehousePicks: [
    {
      pickID: 1,
      pickNo: 'LL202505200001',
      planId: 1,
      pickDate: '2025-05-20',
      totalAmount: 5000.00,
      status: 'confirmed',
      operator: '陈立国'
    }
  ],

  warehouseTransfers: [
    {
      transferID: 1,
      transferNo: 'DB202505200001',
      fromWarehouse: '材料仓',
      toWarehouse: '车间仓',
      transferDate: '2025-05-21',
      status: 'completed',
      operator: '陈立国'
    }
  ],

  warehouseReturns: [],
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
    deliveryID: 2,
    pickID: 2,
    transferID: 2,
    returnID: 1,
    receiptID: 1
  }
}
