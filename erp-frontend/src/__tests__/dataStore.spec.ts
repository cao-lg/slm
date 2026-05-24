import { describe, it, expect, beforeEach } from 'vitest'
import { dataStore } from '@/utils/dataStore'

const STORAGE_KEY = 'erp_data_store'

describe('DataStore 数据持久化测试', () => {
  beforeEach(() => {
    localStorage.clear()
    dataStore.reset()
  })

  describe('数据保存功能', () => {
    it('添加客户后数据应该保存到 localStorage', () => {
      const initialCount = dataStore.getCustomers().length
      const newCustomer = {
        customerCode: 'KH202505200100',
        customerName: '测试客户',
        contact: '测试联系人',
        phone: '13800138100',
        email: 'test@test.com',
        address: '测试地址',
        status: 1
      }
      
      dataStore.addCustomer(newCustomer)
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      expect(storedData).not.toBeNull()
      
      const parsed = JSON.parse(storedData!)
      expect(parsed.customers.length).toBe(initialCount + 1)
      expect(parsed.customers[parsed.customers.length - 1].customerName).toBe('测试客户')
    })

    it('添加产品后数据应该保存到 localStorage', () => {
      const initialCount = dataStore.getProducts().length
      const newProduct = {
        productCode: 'CP202505200100',
        productName: '测试产品',
        category: '测试类别',
        unit: '个',
        spec: '测试规格',
        price: 100.00,
        cost: 50.00,
        status: 1
      }
      
      dataStore.addProduct(newProduct)
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      expect(storedData).not.toBeNull()
      
      const parsed = JSON.parse(storedData!)
      expect(parsed.products.length).toBe(initialCount + 1)
      expect(parsed.products[parsed.products.length - 1].productName).toBe('测试产品')
    })

    it('更新客户信息后应该保存到 localStorage', () => {
      const customerID = 1
      const originalCustomer = dataStore.getCustomer(customerID)
      expect(originalCustomer).toBeDefined()
      
      dataStore.updateCustomer(customerID, { customerName: '更新的客户名称' })
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      const updatedCustomer = parsed.customers.find((c: any) => c.customerID === customerID)
      
      expect(updatedCustomer.customerName).toBe('更新的客户名称')
    })

    it('删除客户后应该更新 localStorage', () => {
      const initialCount = dataStore.getCustomers().length
      const customerIDToDelete = 1
      
      dataStore.deleteCustomer(customerIDToDelete)
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      
      expect(parsed.customers.length).toBe(initialCount - 1)
      expect(parsed.customers.find((c: any) => c.customerID === customerIDToDelete)).toBeUndefined()
    })
  })

  describe('数据加载功能', () => {
    it('首次加载时应该使用默认数据', () => {
      const customers = dataStore.getCustomers()
      expect(customers.length).toBeGreaterThan(0)
      
      const products = dataStore.getProducts()
      expect(products.length).toBeGreaterThan(0)
    })

    it('从 localStorage 加载数据应该正确恢复状态', () => {
      const customData = {
        customers: [{ customerID: 999, customerName: '自定义客户' }],
        quotations: [],
        salesOrders: [],
        products: [{ productID: 999, productName: '自定义产品' }],
        suppliers: [],
        purchaseOrders: [],
        materials: [],
        productionPlans: [],
        receivables: [],
        payables: [],
        warehouseDeliveries: [],
        warehousePicks: [],
        warehouseTransfers: [],
        warehouseReturns: [],
        receipts: [],
        nextIds: {
          customerID: 1000,
          quotationID: 1,
          orderID: 1,
          productID: 1000,
          supplierID: 1,
          poID: 1,
          materialID: 1,
          planId: 1,
          receivableID: 1,
          payableID: 1,
          deliveryID: 100,
          pickID: 100,
          transferID: 100,
          returnID: 100,
          receiptID: 100
        }
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customData))
      
      dataStore.reset()
      
      const customers = dataStore.getCustomers()
      expect(customers.length).toBe(1)
      expect(customers[0].customerID).toBe(999)
      
      const products = dataStore.getProducts()
      expect(products.length).toBe(1)
      expect(products[0].productID).toBe(999)
    })

    it('数据加载时应该保留默认值中的必要字段', () => {
      const customData = {
        customers: [],
        quotations: [],
        salesOrders: [],
        products: [],
        suppliers: [],
        purchaseOrders: [],
        materials: [],
        productionPlans: [],
        receivables: [],
        payables: [],
        warehouseDeliveries: [],
        warehousePicks: [],
        warehouseTransfers: [],
        warehouseReturns: [],
        receipts: [],
        nextIds: {}
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customData))
      dataStore.reset()
      
      const customers = dataStore.getCustomers()
      expect(customers.length).toBeGreaterThan(0)
      
      const nextIds = (dataStore as any).data.nextIds
      expect(nextIds.customerID).toBeDefined()
      expect(nextIds.productID).toBeDefined()
    })
  })

  describe('ID生成功能', () => {
    it('getNextId 应该返回并递增 ID', () => {
      const nextId1 = dataStore.getNextId('customerID')
      expect(nextId1).toBeDefined()
      expect(typeof nextId1).toBe('number')
      
      const nextId2 = dataStore.getNextId('customerID')
      expect(nextId2).toBe(nextId1 + 1)
    })

    it('添加客户时应该自动生成 customerID', () => {
      const initialCustomers = dataStore.getCustomers()
      const maxInitialID = Math.max(...initialCustomers.map(c => c.customerID))
      
      const newCustomer = {
        customerCode: 'KH202505200200',
        customerName: 'ID测试客户',
        contact: '测试',
        phone: '13800138200',
        status: 1
      }
      
      const addedCustomer = dataStore.addCustomer(newCustomer)
      
      expect(addedCustomer.customerID).toBeGreaterThan(maxInitialID)
    })

    it('添加产品时应该自动生成 productID', () => {
      const initialProducts = dataStore.getProducts()
      const maxInitialID = Math.max(...initialProducts.map(p => p.productID))
      
      const newProduct = {
        productCode: 'CP202505200200',
        productName: 'ID测试产品',
        category: '测试',
        unit: '个',
        price: 100,
        cost: 50,
        status: 1
      }
      
      const addedProduct = dataStore.addProduct(newProduct)
      
      expect(addedProduct.productID).toBeGreaterThan(maxInitialID)
    })

    it('ID 应该持久化到 localStorage', () => {
      dataStore.getNextId('testID')
      dataStore.getNextId('testID')
      dataStore.getNextId('testID')
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      
      expect(parsed.nextIds.testID).toBe(4)
    })

    it('新的 ID 类型应该从 1 开始', () => {
      const newIdKey = 'brandNewID'
      const nextId = dataStore.getNextId(newIdKey)
      
      expect(nextId).toBe(1)
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      expect(parsed.nextIds[newIdKey]).toBe(2)
    })
  })

  describe('数据更新功能', () => {
    it('更新客户信息应该修改内存和存储中的数据', () => {
      const customerID = 1
      const updates = {
        customerName: '修改后的客户名',
        contact: '新的联系人',
        phone: '99999999999'
      }
      
      dataStore.updateCustomer(customerID, updates)
      
      const updatedCustomer = dataStore.getCustomer(customerID)
      expect(updatedCustomer).toBeDefined()
      expect(updatedCustomer!.customerName).toBe('修改后的客户名')
      expect(updatedCustomer!.contact).toBe('新的联系人')
      expect(updatedCustomer!.phone).toBe('99999999999')
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      const storedCustomer = parsed.customers.find((c: any) => c.customerID === customerID)
      expect(storedCustomer.customerName).toBe('修改后的客户名')
    })

    it('更新产品信息应该修改内存和存储中的数据', () => {
      const productID = 1
      const updates = {
        productName: '修改后的产品名',
        price: 199.99,
        status: 0
      }
      
      dataStore.updateProduct(productID, updates)
      
      const updatedProduct = dataStore.getProduct(productID)
      expect(updatedProduct).toBeDefined()
      expect(updatedProduct!.productName).toBe('修改后的产品名')
      expect(updatedProduct!.price).toBe(199.99)
      expect(updatedProduct!.status).toBe(0)
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      const storedProduct = parsed.products.find((p: any) => p.productID === productID)
      expect(storedProduct.productName).toBe('修改后的产品名')
    })

    it('更新应收账款应该持久化到 localStorage', () => {
      const receivableID = 1
      const initialReceivable = dataStore.getReceivable(receivableID)
      expect(initialReceivable).toBeDefined()
      
      dataStore.updateReceivable(receivableID, {
        receivedAmount: 1000,
        status: 'partial'
      })
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      const storedReceivable = parsed.receivables.find((r: any) => r.receivableID === receivableID)
      
      expect(storedReceivable.receivedAmount).toBe(1000)
      expect(storedReceivable.status).toBe('partial')
    })

    it('更新应付账款应该持久化到 localStorage', () => {
      const payableID = 1
      const initialPayable = dataStore.getPayable(payableID)
      expect(initialPayable).toBeDefined()
      
      dataStore.updatePayable(payableID, {
        paidAmount: 2000,
        status: 'partial'
      })
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      const storedPayable = parsed.payables.find((p: any) => p.payableID === payableID)
      
      expect(storedPayable.paidAmount).toBe(2000)
      expect(storedPayable.status).toBe('partial')
    })

    it('更新生产计划应该持久化到 localStorage', () => {
      const planId = 1
      const initialPlan = dataStore.getProductionPlan(planId)
      expect(initialPlan).toBeDefined()
      
      dataStore.updateProductionPlan(planId, {
        completedQuantity: 80,
        status: 'completed'
      })
      
      const storedData = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(storedData!)
      const storedPlan = parsed.productionPlans.find((p: any) => p.planId === planId)
      
      expect(storedPlan.completedQuantity).toBe(80)
      expect(storedPlan.status).toBe('completed')
    })
  })

  describe('CRUD 操作集成测试', () => {
    it('完整的客户 CRUD 操作流程', () => {
      const initialCount = dataStore.getCustomers().length
      
      const newCustomer = {
        customerCode: 'KH202505200300',
        customerName: 'CRUD测试客户',
        contact: '测试',
        phone: '13800138300',
        status: 1
      }
      
      const added = dataStore.addCustomer(newCustomer)
      expect(added.customerID).toBeDefined()
      expect(dataStore.getCustomers().length).toBe(initialCount + 1)
      
      dataStore.updateCustomer(added.customerID, { customerName: '更新后' })
      const updated = dataStore.getCustomer(added.customerID)
      expect(updated!.customerName).toBe('更新后')
      
      dataStore.deleteCustomer(added.customerID)
      expect(dataStore.getCustomers().length).toBe(initialCount)
      expect(dataStore.getCustomer(added.customerID)).toBeUndefined()
    })

    it('完整的产品 CRUD 操作流程', () => {
      const initialCount = dataStore.getProducts().length
      
      const newProduct = {
        productCode: 'CP202505200300',
        productName: 'CRUD测试产品',
        category: '测试',
        unit: '个',
        price: 150,
        cost: 75,
        status: 1
      }
      
      const added = dataStore.addProduct(newProduct)
      expect(added.productID).toBeDefined()
      expect(dataStore.getProducts().length).toBe(initialCount + 1)
      
      dataStore.updateProduct(added.productID, { price: 199 })
      const updated = dataStore.getProduct(added.productID)
      expect(updated!.price).toBe(199)
      
      dataStore.deleteProduct(added.productID)
      expect(dataStore.getProducts().length).toBe(initialCount)
      expect(dataStore.getProduct(added.productID)).toBeUndefined()
    })
  })

  describe('数据导入导出', () => {
    it('应该正确导出数据', () => {
      const exported = dataStore.exportData()
      expect(exported).toBeDefined()
      expect(typeof exported).toBe('string')
      
      const parsed = JSON.parse(exported)
      expect(parsed.customers).toBeDefined()
      expect(parsed.products).toBeDefined()
    })

    it('应该正确导入数据', () => {
      const exportData = {
        customers: [{ customerID: 888, customerName: '导入客户' }],
        quotations: [],
        salesOrders: [],
        products: [{ productID: 888, productName: '导入产品' }],
        suppliers: [],
        purchaseOrders: [],
        materials: [],
        productionPlans: [],
        receivables: [],
        payables: [],
        warehouseDeliveries: [],
        warehousePicks: [],
        warehouseTransfers: [],
        warehouseReturns: [],
        receipts: [],
        nextIds: {
          customerID: 889,
          quotationID: 1,
          orderID: 1,
          productID: 889,
          supplierID: 1,
          poID: 1,
          materialID: 1,
          planId: 1,
          receivableID: 1,
          payableID: 1,
          deliveryID: 100,
          pickID: 100,
          transferID: 100,
          returnID: 100,
          receiptID: 100
        }
      }
      
      const result = dataStore.importData(JSON.stringify(exportData))
      expect(result).toBe(true)
      
      const customers = dataStore.getCustomers()
      expect(customers.length).toBe(1)
      expect(customers[0].customerID).toBe(888)
      
      const products = dataStore.getProducts()
      expect(products.length).toBe(1)
      expect(products[0].productID).toBe(888)
    })
  })

  describe('边界情况测试', () => {
    it('localStorage 损坏时应该回退到默认数据', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json{')
      dataStore.reset()
      
      const customers = dataStore.getCustomers()
      expect(customers.length).toBeGreaterThan(0)
    })

    it('更新不存在的客户应该不报错', () => {
      expect(() => {
        dataStore.updateCustomer(99999, { customerName: '不存在' })
      }).not.toThrow()
    })

    it('删除不存在的客户应该不报错', () => {
      expect(() => {
        dataStore.deleteCustomer(99999)
      }).not.toThrow()
    })

    it('获取不存在的客户应该返回 undefined', () => {
      const customer = dataStore.getCustomer(99999)
      expect(customer).toBeUndefined()
    })
  })
})
