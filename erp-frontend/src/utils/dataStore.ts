// 前端数据持久化工具
// 使用 localStorage + 内存缓存实现数据保存

import { DEMO_ACCOUNT_DATA } from './demoData'

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
  customers: DEMO_ACCOUNT_DATA.customers,
  quotations: DEMO_ACCOUNT_DATA.quotations,
  salesOrders: DEMO_ACCOUNT_DATA.salesOrders,
  products: DEMO_ACCOUNT_DATA.products,
  suppliers: DEMO_ACCOUNT_DATA.suppliers,
  purchaseOrders: DEMO_ACCOUNT_DATA.purchaseOrders,
  materials: DEMO_ACCOUNT_DATA.materials,
  productionPlans: DEMO_ACCOUNT_DATA.productionPlans,
  receivables: DEMO_ACCOUNT_DATA.receivables,
  payables: DEMO_ACCOUNT_DATA.payables,
  warehouseDeliveries: DEMO_ACCOUNT_DATA.warehouseDeliveries,
  warehousePicks: DEMO_ACCOUNT_DATA.warehousePicks,
  warehouseTransfers: DEMO_ACCOUNT_DATA.warehouseTransfers,
  warehouseReturns: DEMO_ACCOUNT_DATA.warehouseReturns,
  receipts: DEMO_ACCOUNT_DATA.receipts,
  nextIds: DEMO_ACCOUNT_DATA.nextIds
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
      const parsed = JSON.parse(jsonData)
      this.data = { ...DEFAULT_DATA, ...parsed }
      this.saveToStorage()
      console.log('[DataStore] 数据导入成功')
      return true
    } catch (e) {
      console.error('[DataStore] 导入数据失败:', e)
      return false
    }
  }

  // 加载示例数据
  loadDemoData() {
    this.data = { ...DEFAULT_DATA }
    this.saveToStorage()
    console.log('[DataStore] 已加载示例数据')
  }

  // 下载当前数据为 JSON 文件
  downloadData(filename?: string) {
    const dataStr = JSON.stringify(this.data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `erp-data-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    console.log('[DataStore] 数据已下载')
  }

  // 下载示例数据
  downloadDemoData(filename?: string) {
    const dataStr = JSON.stringify(DEMO_ACCOUNT_DATA, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'erp-demo-data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    console.log('[DataStore] 示例数据已下载')
  }

  // 获取数据统计信息
  getStats() {
    return {
      customers: this.data.customers.length,
      products: this.data.products.length,
      suppliers: this.data.suppliers.length,
      materials: this.data.materials.length,
      quotations: this.data.quotations.length,
      salesOrders: this.data.salesOrders.length,
      purchaseOrders: this.data.purchaseOrders.length,
      productionPlans: this.data.productionPlans.length,
      receivables: this.data.receivables.length,
      payables: this.data.payables.length
    }
  }

  // 获取当前数据
  getCurrentData() {
    return { ...this.data }
  }

  // 数据验证
  validateData(data: any) {
    if (!data) return false
    const requiredFields = [
      'customers', 'products', 'suppliers', 'materials',
      'quotations',
      'salesOrders', 'purchaseOrders', 'productionPlans',
      'receivables', 'payables'
    ]
    return requiredFields.every(field => 
      data[field] && Array.isArray(data[field])
    ) && data.nextIds !== undefined
  }
}

export const dataStore = new DataStoreManager()
