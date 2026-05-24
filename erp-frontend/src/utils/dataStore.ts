// 前端数据持久化工具
// 使用 localStorage + 内存缓存实现数据保存

const STORAGE_KEY = 'erp_data_store'

interface DataStore {
  customers: any[]
  quotations: any[]
  salesOrders: any[]
  products: any[]
  suppliers: any[]
  purchaseOrders: any[]
  materials: any[]
  productionPlans: any[]
  receivables: any[]
  payables: any[]
  warehouseDeliveries: any[]
  warehousePicks: any[]
  warehouseTransfers: any[]
  warehouseReturns: any[]
  receipts: any[]
  nextIds: Record<string, number>
}

const DEFAULT_DATA: DataStore = {
  customers: [
    {
      customerID: 1,
      customerCode: 'KH202505200001',
      customerName: '北京科技有限公司',
      contact: '张三',
      phone: '13800138001',
      fax: '010-66666666',
      email: 'zhang@tech.com',
      address: '北京市朝阳区望京',
      status: 1
    },
    {
      customerID: 2,
      customerCode: 'KH202505200002',
      customerName: '上海商贸集团',
      contact: '李四',
      phone: '13800138002',
      fax: '021-77777777',
      email: 'li@trade.com',
      address: '上海市浦东新区',
      status: 1
    },
    {
      customerID: 3,
      customerCode: 'KH202505200003',
      customerName: '广州电子科技',
      contact: '王五',
      phone: '13800138003',
      fax: '020-88888888',
      email: 'wang@electronics.com',
      address: '广州市天河区',
      status: 1
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
      totalAmount: 5000.00,
      status: 'accepted',
      creator: '陈立国'
    },
    {
      quotationID: 2,
      quotationNo: 'BJ202505200002',
      customerID: 2,
      customerName: '上海商贸集团',
      quotationDate: '2025-05-18',
      validUntil: '2025-06-18',
      totalAmount: 8000.00,
      status: 'pending',
      creator: '陈立国'
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
      totalAmount: 5000.00,
      status: 'pending',
      creator: '陈立国'
    },
    {
      orderID: 2,
      orderNo: 'XS202505200002',
      customerID: 2,
      customerName: '上海商贸集团',
      orderDate: '2025-05-18',
      deliveryDate: '2025-05-28',
      totalAmount: 8000.00,
      status: 'approved',
      creator: '陈立国'
    },
    {
      orderID: 3,
      orderNo: 'XS202505200003',
      customerID: 3,
      customerName: '广州电子科技',
      orderDate: '2025-05-15',
      deliveryDate: '2025-05-25',
      totalAmount: 12000.00,
      status: 'producing',
      creator: '陈立国'
    }
  ],
  products: [
    {
      productID: 1,
      productCode: 'CP202505200001',
      productName: 'A型配件',
      category: '配件',
      unit: '个',
      spec: '直径10mm',
      price: 100.00,
      cost: 50.00,
      status: 1
    },
    {
      productID: 2,
      productCode: 'CP202505200002',
      productName: 'B型组件',
      category: '组件',
      unit: '套',
      spec: '尺寸20x30cm',
      price: 200.00,
      cost: 100.00,
      status: 1
    },
    {
      productID: 3,
      productCode: 'CP202505200003',
      productName: 'C型零件',
      category: '零件',
      unit: '件',
      spec: '长度5cm',
      price: 50.00,
      cost: 25.00,
      status: 1
    }
  ],
  suppliers: [
    {
      supplierID: 1,
      supplierCode: 'HS01103',
      supplierName: '果山环保',
      contact: '张三',
      phone: '13900139001',
      fax: '0755-66666666',
      email: 'zhang@material.com',
      address: '深圳市南山区',
      status: 1
    },
    {
      supplierID: 2,
      supplierCode: 'HS01105',
      supplierName: '德堡新材',
      contact: '钱七',
      phone: '13900139002',
      fax: '0571-77777777',
      email: 'qian@chemical.com',
      address: '杭州市西湖区',
      status: 1
    },
    {
      supplierID: 3,
      supplierCode: 'GYS202505200003',
      supplierName: '深圳材料厂',
      contact: '李四',
      phone: '13900139003',
      fax: '0755-88888888',
      email: 'li@materials.com',
      address: '深圳市福田区',
      status: 1
    }
  ],
  purchaseOrders: [
    {
      poID: 1,
      poNo: 'CG202505200001',
      supplierID: 1,
      supplierName: '深圳材料厂',
      orderDate: '2025-05-20',
      deliveryDate: '2025-05-30',
      totalAmount: 5000.00,
      status: 'approved',
      creator: '陈立国'
    },
    {
      poID: 2,
      poNo: 'CG202505200002',
      supplierID: 2,
      supplierName: '杭州化工公司',
      orderDate: '2025-05-18',
      deliveryDate: '2025-05-28',
      totalAmount: 8000.00,
      status: 'pending',
      creator: '陈立国'
    }
  ],
  materials: [
    {
      materialID: 1,
      materialCode: 'MA292',
      materialName: '乳液',
      spec: '',
      unit: 'kg',
      category: '面漆2',
      stockQuantity: 1000,
      unitPrice: 10.0,
      status: 1
    },
    {
      materialID: 2,
      materialCode: 'YL202505200002',
      materialName: '金属棒',
      spec: '直径50mm',
      unit: '根',
      category: '金属',
      stockQuantity: 200,
      unitPrice: 25.0,
      status: 1
    },
    {
      materialID: 3,
      materialCode: 'YL202505200003',
      materialName: '螺丝螺母',
      spec: 'M8',
      unit: '套',
      category: '五金',
      stockQuantity: 1000,
      unitPrice: 0.5,
      status: 1
    },
    {
      materialID: 4,
      materialCode: 'YL202505200004',
      materialName: '橡胶垫片',
      spec: '5mm',
      unit: '片',
      category: '橡胶',
      stockQuantity: 2000,
      unitPrice: 0.2,
      status: 1
    }
  ],
  productionPlans: [
    {
      planId: 1,
      planNo: 'SC202505200001',
      productId: 1,
      productName: 'A型配件',
      plannedQuantity: 100,
      completedQuantity: 60,
      startDate: '2025-05-20',
      endDate: '2025-05-30',
      responsible: '张三',
      status: 'producing',
      remark: '紧急订单',
      createDate: '2025-05-20 09:00:00',
      creator: '陈立国',
      recipeId: 1,
      recipeName: 'A型配件配方'
    },
    {
      planId: 2,
      planNo: 'SC202505200002',
      productId: 2,
      productName: 'B型组件',
      plannedQuantity: 50,
      completedQuantity: 0,
      startDate: '2025-05-18',
      endDate: '2025-05-28',
      responsible: '李四',
      status: 'pending',
      remark: '',
      createDate: '2025-05-18 10:00:00',
      creator: '陈立国',
      recipeId: 2,
      recipeName: 'B型组件配方'
    },
    {
      planId: 3,
      planNo: 'SC202505150001',
      productId: 3,
      productName: 'C型零件',
      plannedQuantity: 200,
      completedQuantity: 200,
      startDate: '2025-05-15',
      endDate: '2025-05-25',
      responsible: '王五',
      status: 'completed',
      remark: '已全部完成入库',
      createDate: '2025-05-15 08:00:00',
      creator: '陈立国',
      recipeId: null,
      recipeName: ''
    }
  ],
  receivables: [
    {
      receivableID: 1,
      orderID: 1,
      orderNo: 'XS202505200001',
      customerID: 1,
      customerName: '北京科技有限公司',
      totalAmount: 5000.00,
      receivedAmount: 3000.00,
      pendingAmount: 2000.00,
      status: 'partial',
      createDate: '2025-05-20'
    },
    {
      receivableID: 2,
      orderID: 2,
      orderNo: 'XS202505200002',
      customerID: 2,
      customerName: '上海商贸集团',
      totalAmount: 8000.00,
      receivedAmount: 0.00,
      pendingAmount: 8000.00,
      status: 'unpaid',
      createDate: '2025-05-18'
    },
    {
      receivableID: 3,
      orderID: 3,
      orderNo: 'XS202505200003',
      customerID: 3,
      customerName: '广州电子科技',
      totalAmount: 12000.00,
      receivedAmount: 12000.00,
      pendingAmount: 0.00,
      status: 'paid',
      createDate: '2025-05-15'
    }
  ],
  payables: [
    {
      payableID: 1,
      poID: 1,
      poNo: 'CG202505200001',
      supplierID: 1,
      supplierName: '深圳材料厂',
      totalAmount: 5000.00,
      paidAmount: 2000.00,
      pendingAmount: 3000.00,
      status: 'partial',
      createDate: '2025-05-20'
    },
    {
      payableID: 2,
      poID: 2,
      poNo: 'CG202505200002',
      supplierID: 2,
      supplierName: '杭州化工公司',
      totalAmount: 8000.00,
      paidAmount: 0.00,
      pendingAmount: 8000.00,
      status: 'unpaid',
      createDate: '2025-05-18'
    },
    {
      payableID: 3,
      poID: 3,
      poNo: 'CG202505200003',
      supplierID: 1,
      supplierName: '深圳材料厂',
      totalAmount: 12000.00,
      paidAmount: 12000.00,
      pendingAmount: 0.00,
      status: 'paid',
      createDate: '2025-05-15'
    }
  ],
  warehouseDeliveries: [],
  warehousePicks: [],
  warehouseTransfers: [],
  warehouseReturns: [],
  receipts: [],
  nextIds: {
    customerID: 4,
    quotationID: 3,
    orderID: 4,
    productID: 4,
    supplierID: 4,
    poID: 3,
    materialID: 5,
    planId: 4,
    receivableID: 4,
    payableID: 4,
    deliveryID: 100,
    pickID: 100,
    transferID: 100,
    returnID: 100,
    receiptID: 100
  }
}

class DataStoreManager {
  private data: DataStore
  private initialized: boolean = false

  constructor() {
    this.data = { ...DEFAULT_DATA }
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        this.data = {
          ...DEFAULT_DATA,
          ...parsed
        }
        console.log('[DataStore] 已从 localStorage 加载数据')
      } else {
        console.log('[DataStore] 使用默认数据')
      }
    } catch (e) {
      console.error('[DataStore] 读取数据失败:', e)
      this.data = { ...DEFAULT_DATA }
    }
    this.initialized = true
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
      console.log('[DataStore] 数据已保存到 localStorage')
    } catch (e) {
      console.error('[DataStore] 保存数据失败:', e)
    }
  }

  getNextId(key: string): number {
    if (!this.data.nextIds[key]) {
      this.data.nextIds[key] = 1
    }
    return this.data.nextIds[key]++
  }

  // 客户相关
  getCustomers() {
    return this.data.customers
  }

  addCustomer(customer: any) {
    customer.customerID = this.getNextId('customerID')
    this.data.customers.push(customer)
    this.saveToStorage()
    return customer
  }

  updateCustomer(customerID: number, updates: any) {
    const index = this.data.customers.findIndex(c => c.customerID === customerID)
    if (index !== -1) {
      this.data.customers[index] = { ...this.data.customers[index], ...updates }
      this.saveToStorage()
    }
  }

  deleteCustomer(customerID: number) {
    this.data.customers = this.data.customers.filter(c => c.customerID !== customerID)
    this.saveToStorage()
  }

  getCustomer(customerID: number) {
    return this.data.customers.find(c => c.customerID === customerID)
  }

  // 产品相关
  getProducts() {
    return this.data.products
  }

  addProduct(product: any) {
    product.productID = this.getNextId('productID')
    this.data.products.push(product)
    this.saveToStorage()
    return product
  }

  updateProduct(productID: number, updates: any) {
    const index = this.data.products.findIndex(p => p.productID === productID)
    if (index !== -1) {
      this.data.products[index] = { ...this.data.products[index], ...updates }
      this.saveToStorage()
    }
  }

  deleteProduct(productID: number) {
    this.data.products = this.data.products.filter(p => p.productID !== productID)
    this.saveToStorage()
  }

  getProduct(productID: number) {
    return this.data.products.find(p => p.productID === productID)
  }

  // 报价单相关
  getQuotations() {
    return this.data.quotations
  }

  getQuotation(quotationID: number) {
    return this.data.quotations.find(q => q.quotationID === quotationID)
  }

  // 销售订单相关
  getSalesOrders() {
    return this.data.salesOrders
  }

  getSalesOrder(orderID: number) {
    return this.data.salesOrders.find(o => o.orderID === orderID)
  }

  updateSalesOrder(orderID: number, updates: any) {
    const index = this.data.salesOrders.findIndex(o => o.orderID === orderID)
    if (index !== -1) {
      this.data.salesOrders[index] = { ...this.data.salesOrders[index], ...updates }
      this.saveToStorage()
    }
  }

  // 供应商相关
  getSuppliers() {
    return this.data.suppliers
  }

  getSupplier(supplierID: number) {
    return this.data.suppliers.find(s => s.supplierID === supplierID)
  }

  // 采购订单相关
  getPurchaseOrders() {
    return this.data.purchaseOrders
  }

  getPurchaseOrder(poID: number) {
    return this.data.purchaseOrders.find(o => o.poID === poID)
  }

  // 物料相关
  getMaterials() {
    return this.data.materials
  }

  getMaterial(materialID: number) {
    return this.data.materials.find(m => m.materialID === materialID)
  }

  // 生产计划相关
  getProductionPlans() {
    return this.data.productionPlans
  }

  getProductionPlan(planId: number) {
    return this.data.productionPlans.find(p => p.planId === planId)
  }

  updateProductionPlan(planId: number, updates: any) {
    const index = this.data.productionPlans.findIndex(p => p.planId === planId)
    if (index !== -1) {
      this.data.productionPlans[index] = { ...this.data.productionPlans[index], ...updates }
      this.saveToStorage()
    }
  }

  // 应收账款相关
  getReceivables() {
    return this.data.receivables
  }

  getReceivable(receivableID: number) {
    return this.data.receivables.find(r => r.receivableID === receivableID)
  }

  updateReceivable(receivableID: number, updates: any) {
    const index = this.data.receivables.findIndex(r => r.receivableID === receivableID)
    if (index !== -1) {
      this.data.receivables[index] = { ...this.data.receivables[index], ...updates }
      this.saveToStorage()
    }
  }

  // 应付账款相关
  getPayables() {
    return this.data.payables
  }

  getPayable(payableID: number) {
    return this.data.payables.find(p => p.payableID === payableID)
  }

  updatePayable(payableID: number, updates: any) {
    const index = this.data.payables.findIndex(p => p.payableID === payableID)
    if (index !== -1) {
      this.data.payables[index] = { ...this.data.payables[index], ...updates }
      this.saveToStorage()
    }
  }

  // 清空所有数据（重置）
  reset() {
    this.data = { ...DEFAULT_DATA }
    this.saveToStorage()
    console.log('[DataStore] 数据已重置')
  }

  // 导出数据
  exportData() {
    return JSON.stringify(this.data, null, 2)
  }

  // 导入数据
  importData(jsonData: string) {
    try {
      this.data = JSON.parse(jsonData)
      this.saveToStorage()
      return true
    } catch (e) {
      console.error('[DataStore] 导入数据失败:', e)
      return false
    }
  }
}

export const dataStore = new DataStoreManager()
