import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './storage'
import router from '@/router'
import { dataStore } from './dataStore'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  adapter: (config) => {
    return new Promise((resolve) => {
      let url = config.url || ''
      if (url.startsWith('/api')) {
        url = url.substring(4)
      }

      console.log('[API]', config.method?.toUpperCase(), url, config.data || config.params)

      const response = handleRequest(url, config.method || 'GET', config.data, config.params)

      setTimeout(() => {
        resolve({
          data: response,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config
        })
      }, 100)
    })
  }
})

function handleRequest(url: string, method: string, data?: any, params?: any) {
  // 认证相关
  if (url.includes('/auth/login')) {
    return {
      code: 200,
      message: 'success',
      data: {
        token: 'mock_token_' + Date.now(),
        userInfo: {
          userId: 1,
          username: 'CLG',
          realName: '陈立国',
          role: 'admin',
          department: '系统管理'
        }
      }
    }
  }

  if (url.includes('/auth/userinfo')) {
    return {
      code: 200,
      message: 'success',
      data: {
        userId: 1,
        username: 'CLG',
        realName: '陈立国',
        role: 'admin',
        department: '系统管理',
        email: 'clg@company.com',
        phone: '13800138000'
      }
    }
  }

  if (url.includes('/auth/logout')) {
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 客户管理
  if (url.includes('/sales/customers') && method === 'GET') {
    const customers = dataStore.getCustomers()
    return {
      code: 200,
      message: 'success',
      data: {
        list: customers,
        total: customers.length
      }
    }
  }

  if (url.includes('/sales/customers') && method === 'POST') {
    const customer = dataStore.addCustomer(data)
    return {
      code: 200,
      message: 'success',
      data: customer
    }
  }

  if (url.match(/\/sales\/customers\/(\d+)/) && method === 'PUT') {
    const customerID = parseInt(url.match(/\/sales\/customers\/(\d+)/)?.[1] || '0')
    dataStore.updateCustomer(customerID, data)
    return {
      code: 200,
      message: 'success',
      data: dataStore.getCustomer(customerID)
    }
  }

  if (url.match(/\/sales\/customers\/(\d+)/) && method === 'DELETE') {
    const customerID = parseInt(url.match(/\/sales\/customers\/(\d+)/)?.[1] || '0')
    dataStore.deleteCustomer(customerID)
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 产品管理
  if (url.includes('/product/products') && method === 'GET') {
    if (url.match(/\/product\/products\/(\d+)/)) {
      const productID = parseInt(url.match(/\/product\/products\/(\d+)/)?.[1] || '0')
      const product = dataStore.getProduct(productID)
      return {
        code: 200,
        message: 'success',
        data: product
      }
    }
    const products = dataStore.getProducts()
    return {
      code: 200,
      message: 'success',
      data: {
        list: products,
        total: products.length
      }
    }
  }

  if (url.includes('/product/products') && method === 'POST') {
    const product = dataStore.addProduct(data)
    return {
      code: 200,
      message: 'success',
      data: product
    }
  }

  if (url.match(/\/product\/products\/(\d+)/) && method === 'PUT') {
    const productID = parseInt(url.match(/\/product\/products\/(\d+)/)?.[1] || '0')
    dataStore.updateProduct(productID, data)
    return {
      code: 200,
      message: 'success',
      data: dataStore.getProduct(productID)
    }
  }

  if (url.match(/\/product\/products\/(\d+)/) && method === 'DELETE') {
    const productID = parseInt(url.match(/\/product\/products\/(\d+)/)?.[1] || '0')
    dataStore.deleteProduct(productID)
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 报价单
  if (url.includes('/sales/quotations') && method === 'GET') {
    if (url.match(/\/sales\/quotations\/(\d+)/)) {
      const quotationID = parseInt(url.match(/\/sales\/quotations\/(\d+)/)?.[1] || '0')
      const quotation = dataStore.getQuotation(quotationID)
      return {
        code: 200,
        message: 'success',
        data: quotation
      }
    }
    const quotations = dataStore.getQuotations()
    return {
      code: 200,
      message: 'success',
      data: {
        list: quotations,
        total: quotations.length
      }
    }
  }

  // 销售订单
  if (url.includes('/sales/orders') && method === 'GET') {
    if (url.match(/\/sales\/orders\/(\d+)/)) {
      const orderID = parseInt(url.match(/\/sales\/orders\/(\d+)/)?.[1] || '0')
      const order = dataStore.getSalesOrder(orderID)
      return {
        code: 200,
        message: 'success',
        data: order
      }
    }
    const orders = dataStore.getSalesOrders()
    return {
      code: 200,
      message: 'success',
      data: {
        list: orders,
        total: orders.length
      }
    }
  }

  // 供应商
  if (url.includes('/purchase/suppliers') && method === 'GET') {
    const suppliers = dataStore.getSuppliers()
    return {
      code: 200,
      message: 'success',
      data: {
        list: suppliers,
        total: suppliers.length
      }
    }
  }

  // 采购订单
  if (url.includes('/purchase/orders') && method === 'GET') {
    const purchaseOrders = dataStore.getPurchaseOrders()
    return {
      code: 200,
      message: 'success',
      data: {
        list: purchaseOrders,
        total: purchaseOrders.length
      }
    }
  }

  // 物料
  if (url.includes('/purchase/materials') && method === 'GET') {
    const materials = dataStore.getMaterials()
    return {
      code: 200,
      message: 'success',
      data: {
        list: materials,
        total: materials.length
      }
    }
  }

  // 生产计划
  if (url.includes('/production/plans') && method === 'GET') {
    if (url.match(/\/production\/plans\/(\d+)/)) {
      const planId = parseInt(url.match(/\/production\/plans\/(\d+)/)?.[1] || '0')
      const plan = dataStore.getProductionPlan(planId)
      return {
        code: 200,
        message: 'success',
        data: plan
      }
    }
    const plans = dataStore.getProductionPlans()
    return {
      code: 200,
      message: 'success',
      data: {
        list: plans,
        total: plans.length
      }
    }
  }

  // 应收账款
  if (url.includes('/finance/receivables') && method === 'GET') {
    if (url.match(/\/finance\/receivables\/(\d+)/)) {
      const receivableID = parseInt(url.match(/\/finance\/receivables\/(\d+)/)?.[1] || '0')
      const receivable = dataStore.getReceivable(receivableID)
      return {
        code: 200,
        message: 'success',
        data: receivable
      }
    }
    const receivables = dataStore.getReceivables()
    return {
      code: 200,
      message: 'success',
      data: {
        list: receivables,
        total: receivables.length
      }
    }
  }

  if (url.includes('/finance/receivables') && url.includes('/verify') && method === 'PUT') {
    const receivableID = parseInt(url.match(/\/finance\/receivables\/(\d+)\/verify/)?.[1] || '0')
    const amount = parseFloat(params?.amount || '0')
    const paymentDate = params?.paymentDate || new Date().toISOString().split('T')[0]
    const paymentMethod = params?.paymentMethod || 'transfer'

    const receivable = dataStore.getReceivable(receivableID)
    if (receivable) {
      const newReceivedAmount = receivable.receivedAmount + amount
      const newPendingAmount = Math.max(0, receivable.totalAmount - newReceivedAmount)
      let newStatus = 'unpaid'
      if (newPendingAmount <= 0) newStatus = 'paid'
      else if (newReceivedAmount > 0) newStatus = 'partial'

      dataStore.updateReceivable(receivableID, {
        receivedAmount: newReceivedAmount,
        pendingAmount: newPendingAmount,
        status: newStatus,
        paymentDate,
        paymentMethod
      })
    }
    return {
      code: 200,
      message: 'success',
      data: dataStore.getReceivable(receivableID)
    }
  }

  // 应付账款
  if (url.includes('/finance/payables') && method === 'GET') {
    if (url.match(/\/finance\/payables\/(\d+)/)) {
      const payableID = parseInt(url.match(/\/finance\/payables\/(\d+)/)?.[1] || '0')
      const payable = dataStore.getPayable(payableID)
      return {
        code: 200,
        message: 'success',
        data: payable
      }
    }
    const payables = dataStore.getPayables()
    return {
      code: 200,
      message: 'success',
      data: {
        list: payables,
        total: payables.length
      }
    }
  }

  if (url.includes('/finance/payables') && url.includes('/verify') && method === 'PUT') {
    const payableID = parseInt(url.match(/\/finance\/payables\/(\d+)\/verify/)?.[1] || '0')
    const amount = parseFloat(params?.amount || '0')

    const payable = dataStore.getPayable(payableID)
    if (payable) {
      const newPaidAmount = payable.paidAmount + amount
      const newPendingAmount = Math.max(0, payable.totalAmount - newPaidAmount)
      let newStatus = 'unpaid'
      if (newPendingAmount <= 0) newStatus = 'paid'
      else if (newPaidAmount > 0) newStatus = 'partial'

      dataStore.updatePayable(payableID, {
        paidAmount: newPaidAmount,
        pendingAmount: newPendingAmount,
        status: newStatus
      })
    }
    return {
      code: 200,
      message: 'success',
      data: dataStore.getPayable(payableID)
    }
  }

  // 统计 - 产品汇总
  if (url.includes('/statistics/products')) {
    const products = dataStore.getProducts()
    return {
      code: 200,
      message: 'success',
      data: {
        list: products.map(p => ({
          ...p,
          stockQuantity: 100 + Math.floor(Math.random() * 200),
          totalSales: Math.floor(Math.random() * 10000)
        })),
        total: products.length
      }
    }
  }

  // 统计 - 订单统计
  if (url.includes('/statistics/orders')) {
    const orders = dataStore.getSalesOrders()
    return {
      code: 200,
      message: 'success',
      data: {
        list: orders,
        total: orders.length,
        summary: {
          totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
          pendingCount: orders.filter(o => o.status === 'pending').length,
          approvedCount: orders.filter(o => o.status === 'approved').length,
          completedCount: orders.filter(o => o.status === 'completed').length
        }
      }
    }
  }

  // 统计 - 生产统计
  if (url.includes('/statistics/production')) {
    const plans = dataStore.getProductionPlans()
    return {
      code: 200,
      message: 'success',
      data: {
        list: plans,
        total: plans.length,
        summary: {
          totalPlanned: plans.reduce((sum, p) => sum + (p.plannedQuantity || 0), 0),
          totalCompleted: plans.reduce((sum, p) => sum + (p.completedQuantity || 0), 0),
          pendingCount: plans.filter(p => p.status === 'pending').length,
          producingCount: plans.filter(p => p.status === 'producing').length,
          completedCount: plans.filter(p => p.status === 'completed').length
        }
      }
    }
  }

  // 默认返回成功
  console.warn('[API] 未处理的请求:', method, url)
  return {
    code: 200,
    message: 'success',
    data: null
  }
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || 'Error')
      if (res.code === 401) {
        router.push('/login')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  (error) => {
    ElMessage.error(error.message || 'Request Error')
    return Promise.reject(error)
  }
)

export default request
