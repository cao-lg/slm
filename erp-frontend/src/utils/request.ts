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

  // 系统 - 用户列表
  if (url.includes('/system/user/list') && method === 'GET') {
    const users = dataStore.getUsers()
    return {
      code: 200,
      message: 'success',
      data: {
        list: users,
        total: users.length
      }
    }
  }

  // 系统 - 用户详情
  if (url.includes('/system/user/detail') && method === 'GET') {
    const id = parseInt(params?.id || '0')
    const user = dataStore.getUser(id)
    return {
      code: 200,
      message: 'success',
      data: user
    }
  }

  // 系统 - 添加用户
  if (url.includes('/system/user/add') && method === 'POST') {
    const user = dataStore.addUser(data)
    return {
      code: 200,
      message: 'success',
      data: user
    }
  }

  // 系统 - 更新用户
  if (url.includes('/system/user/update') && method === 'PUT') {
    const id = data?.id
    if (id) {
      dataStore.updateUser(id, data)
    }
    return {
      code: 200,
      message: 'success',
      data: dataStore.getUser(id)
    }
  }

  // 系统 - 删除用户
  if (url.includes('/system/user/delete') && method === 'DELETE') {
    const id = parseInt(params?.id || '0')
    dataStore.deleteUser(id)
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 更新用户状态
  if (url.includes('/system/user/status') && method === 'PUT') {
    const id = data?.id
    const status = data?.status
    if (id !== undefined) {
      dataStore.updateUser(id, { status })
    }
    return {
      code: 200,
      message: 'success',
      data: dataStore.getUser(id)
    }
  }

  // 系统 - 修改密码
  if (url.includes('/system/user/change-password') && method === 'POST') {
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 重置密码
  if (url.includes('/system/user/reset-password') && method === 'POST') {
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 消息列表
  if (url.includes('/system/message/list') && method === 'GET') {
    const messages = dataStore.getMessages()
    return {
      code: 200,
      message: 'success',
      data: {
        list: messages,
        total: messages.length
      }
    }
  }

  // 系统 - 未读消息
  if (url.includes('/system/message/unread') && method === 'GET') {
    const messages = dataStore.getMessages().filter(m => m.isRead === 0)
    return {
      code: 200,
      message: 'success',
      data: messages
    }
  }

  // 系统 - 消息详情
  if (url.includes('/system/message/detail') && method === 'GET') {
    const messageID = parseInt(params?.messageID || '0')
    const message = dataStore.getMessage(messageID)
    return {
      code: 200,
      message: 'success',
      data: message
    }
  }

  // 系统 - 发布消息
  if (url.includes('/system/message/publish') && method === 'POST') {
    const message = dataStore.addMessage(data)
    return {
      code: 200,
      message: 'success',
      data: message
    }
  }

  // 系统 - 标记已读
  if (url.includes('/system/message/mark-read') && method === 'POST') {
    const messageID = data?.messageID
    if (messageID) {
      dataStore.updateMessage(messageID, { isRead: 1, readDate: new Date().toISOString() })
    }
    return {
      code: 200,
      message: 'success',
      data: dataStore.getMessage(messageID)
    }
  }

  // 系统 - 标记全部已读
  if (url.includes('/system/message/mark-all-read') && method === 'POST') {
    const messages = dataStore.getMessages()
    messages.forEach(m => {
      dataStore.updateMessage(m.messageID, { isRead: 1, readDate: new Date().toISOString() })
    })
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 删除消息
  if (url.includes('/system/message/delete') && method === 'DELETE') {
    const messageID = parseInt(params?.messageID || '0')
    dataStore.deleteMessage(messageID)
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 配置列表
  if (url.includes('/system/config/list') && method === 'GET') {
    let configs = dataStore.getSystemConfigs()
    if (params?.configType) {
      configs = configs.filter(c => c.configType === params.configType)
    }
    return {
      code: 200,
      message: 'success',
      data: configs
    }
  }

  // 系统 - 配置映射
  if (url.includes('/system/config/map') && method === 'GET') {
    const configs = dataStore.getSystemConfigs()
    const configMap: Record<string, string> = {}
    configs.forEach(c => {
      configMap[c.configKey] = c.configValue
    })
    return {
      code: 200,
      message: 'success',
      data: configMap
    }
  }

  // 系统 - 配置值
  if (url.includes('/system/config/value') && method === 'GET') {
    const config = dataStore.getSystemConfig(params?.configKey || '')
    return {
      code: 200,
      message: 'success',
      data: config ? config.configValue : ''
    }
  }

  // 系统 - 更新配置
  if (url.includes('/system/config/update') && method === 'PUT') {
    const configID = data?.configID
    if (configID) {
      dataStore.updateSystemConfig(configID, data)
    }
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 批量更新配置
  if (url.includes('/system/config/batch-update') && method === 'PUT') {
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 删除配置
  if (url.includes('/system/config/delete') && method === 'DELETE') {
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 日志列表
  if (url.includes('/system/log/list') && method === 'GET') {
    const logs = dataStore.getOperationLogs()
    return {
      code: 200,
      message: 'success',
      data: {
        list: logs,
        total: logs.length
      }
    }
  }

  // 系统 - 日志详情
  if (url.includes('/system/log/detail') && method === 'GET') {
    const logID = parseInt(params?.logID || '0')
    const log = dataStore.getOperationLog(logID)
    return {
      code: 200,
      message: 'success',
      data: log
    }
  }

  // 系统 - 日志统计
  if (url.includes('/system/log/stats') && method === 'GET') {
    const logs = dataStore.getOperationLogs()
    return {
      code: 200,
      message: 'success',
      data: {
        total: logs.length,
        today: logs.filter(l => l.operateDate?.startsWith(new Date().toISOString().split('T')[0])).length
      }
    }
  }

  // 系统 - 删除日志
  if (url.includes('/system/log/delete') && method === 'DELETE') {
    const logID = parseInt(params?.logID || '0')
    dataStore.deleteOperationLog(logID)
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 系统 - 清空日志
  if (url.includes('/system/log/clear') && method === 'DELETE') {
    dataStore.clearOperationLogs()
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 财务 - 费用列表
  if (url.includes('/finance/expenses') && method === 'GET') {
    if (url.match(/\/finance\/expenses\/(\d+)/)) {
      const expenseID = parseInt(url.match(/\/finance\/expenses\/(\d+)/)?.[1] || '0')
      const expense = dataStore.getExpense(expenseID)
      return {
        code: 200,
        message: 'success',
        data: expense
      }
    }
    const expenses = dataStore.getExpenses()
    return {
      code: 200,
      message: 'success',
      data: {
        list: expenses,
        total: expenses.length
      }
    }
  }

  // 财务 - 添加费用
  if (url.includes('/finance/expenses') && method === 'POST') {
    const expense = dataStore.addExpense(data)
    return {
      code: 200,
      message: 'success',
      data: expense
    }
  }

  // 财务 - 更新费用
  if (url.match(/\/finance\/expenses\/(\d+)/) && method === 'PUT') {
    const expenseID = parseInt(url.match(/\/finance\/expenses\/(\d+)/)?.[1] || '0')
    dataStore.updateExpense(expenseID, data)
    return {
      code: 200,
      message: 'success',
      data: dataStore.getExpense(expenseID)
    }
  }

  // 财务 - 删除费用
  if (url.match(/\/finance\/expenses\/(\d+)/) && method === 'DELETE') {
    const expenseID = parseInt(url.match(/\/finance\/expenses\/(\d+)/)?.[1] || '0')
    dataStore.deleteExpense(expenseID)
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 财务 - 审批费用
  if (url.includes('/finance/expenses') && url.includes('/approve') && method === 'PUT') {
    const expenseID = parseInt(url.match(/\/finance\/expenses\/(\d+)\/approve/)?.[1] || '0')
    dataStore.updateExpense(expenseID, {
      status: 'approved',
      approverID: data?.approverID,
      approverName: data?.approverName,
      approveDate: new Date().toISOString().split('T')[0],
      approveRemark: data?.approveRemark
    })
    return {
      code: 200,
      message: 'success',
      data: dataStore.getExpense(expenseID)
    }
  }

  // 财务 - 拒绝费用
  if (url.includes('/finance/expenses') && url.includes('/reject') && method === 'PUT') {
    const expenseID = parseInt(url.match(/\/finance\/expenses\/(\d+)\/reject/)?.[1] || '0')
    dataStore.updateExpense(expenseID, {
      status: 'rejected',
      approverID: data?.approverID,
      approverName: data?.approverName,
      approveDate: new Date().toISOString().split('T')[0],
      approveRemark: data?.approveRemark
    })
    return {
      code: 200,
      message: 'success',
      data: dataStore.getExpense(expenseID)
    }
  }

  // 仓库 - 仓库列表
  if (url.includes('/warehouse/list') && method === 'GET') {
    const warehouses = [
      { warehouseID: 1, warehouseCode: 'KCA', warehouseName: 'KCA-车间仓', type: 'workshop', location: 'A区1楼', manager: '张三', status: 1 },
      { warehouseID: 2, warehouseCode: 'KCB', warehouseName: 'KCB-成品仓', type: 'product', location: 'B区1楼', manager: '李四', status: 1 },
      { warehouseID: 3, warehouseCode: 'KCC', warehouseName: 'KCC-材料仓', type: 'material', location: 'C区1楼', manager: '王五', status: 1 },
      { warehouseID: 4, warehouseCode: 'KCD', warehouseName: 'KCD-外仓', type: 'external', location: 'D区1楼', manager: '赵六', status: 1 },
      { warehouseID: 5, warehouseCode: 'KCE', warehouseName: 'KCE-待处理仓', type: 'pending', location: 'E区1楼', manager: '钱七', status: 1 }
    ]
    return {
      code: 200,
      message: 'success',
      data: warehouses
    }
  }

  // 仓库 - 库存列表
  if (url.match(/\/warehouse\/(\d+)\/inventory/) && method === 'GET') {
    const warehouseID = parseInt(url.match(/\/warehouse\/(\d+)\/inventory/)?.[1] || '1')
    const products = dataStore.getProducts()
    const materials = dataStore.getMaterials()
    const inventory = [
      ...products.map((p, i) => ({
        inventoryID: warehouseID * 1000 + i,
        warehouseID,
        productID: p.productID,
        productName: p.productName,
        productCode: p.productCode,
        unit: p.unit,
        spec: p.spec,
        quantity: p.stockQuantity || 0,
        unitCost: p.cost || 0,
        location: `${String.fromCharCode(65 + (i % 5))}${(i % 20) + 1}`,
        updateDate: new Date().toISOString()
      })),
      ...materials.map((m, i) => ({
        inventoryID: warehouseID * 2000 + i,
        warehouseID,
        productID: m.materialID,
        productName: m.materialName,
        productCode: m.materialCode,
        unit: m.unit,
        spec: m.spec,
        quantity: m.stockQuantity || 0,
        unitCost: m.unitPrice || 0,
        location: `${String.fromCharCode(65 + (i % 5))}${(i % 20) + 1}`,
        updateDate: new Date().toISOString()
      }))
    ]
    return {
      code: 200,
      message: 'success',
      data: {
        list: inventory,
        total: inventory.length
      }
    }
  }

  // 仓库 - 入库
  if (url.includes('/warehouse/inventory/in') && method === 'POST') {
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 仓库 - 出库
  if (url.includes('/warehouse/inventory/out') && method === 'POST') {
    return {
      code: 200,
      message: 'success',
      data: null
    }
  }

  // 仓库 - 调拨单列表
  if (url.includes('/warehouse/transfers') && method === 'GET') {
    if (url.match(/\/warehouse\/transfers\/(\d+)\/details/)) {
      return {
        code: 200,
        message: 'success',
        data: []
      }
    }
    const transfers = dataStore.getWarehouseTransfers()
    return {
      code: 200,
      message: 'success',
      data: {
        list: transfers,
        total: transfers.length
      }
    }
  }

  // 仓库 - 添加调拨单
  if (url.includes('/warehouse/transfers') && method === 'POST') {
    const transfer = dataStore.addWarehouseTransfer(data)
    return {
      code: 200,
      message: 'success',
      data: transfer
    }
  }

  // 仓库 - 审批调拨单
  if (url.includes('/warehouse/transfers') && url.includes('/approve') && method === 'PUT') {
    const transferID = parseInt(url.match(/\/warehouse\/transfers\/(\d+)\/approve/)?.[1] || '0')
    dataStore.updateWarehouseTransfer(transferID, { status: 'completed' })
    return {
      code: 200,
      message: 'success',
      data: dataStore.getWarehouseTransfer(transferID)
    }
  }

  // 仓库 - 发货单列表
  if (url.includes('/warehouse/deliveries') && method === 'GET') {
    if (url.match(/\/warehouse\/deliveries\/(\d+)\/details/)) {
      return {
        code: 200,
        message: 'success',
        data: []
      }
    }
    if (url.includes('/warehouse/deliveries/sales-orders')) {
      const orders = dataStore.getSalesOrders().filter(o => o.status === 'approved' || o.status === 'producing')
      return {
        code: 200,
        message: 'success',
        data: orders
      }
    }
    const deliveries = dataStore.getWarehouseDeliveries()
    return {
      code: 200,
      message: 'success',
      data: {
        list: deliveries,
        total: deliveries.length
      }
    }
  }

  // 仓库 - 添加发货单
  if (url.includes('/warehouse/deliveries') && method === 'POST') {
    const delivery = dataStore.addWarehouseDelivery(data)
    return {
      code: 200,
      message: 'success',
      data: delivery
    }
  }

  // 仓库 - 发货
  if (url.includes('/warehouse/deliveries') && url.includes('/ship') && method === 'PUT') {
    const deliveryID = parseInt(url.match(/\/warehouse\/deliveries\/(\d+)\/ship/)?.[1] || '0')
    dataStore.updateWarehouseDelivery(deliveryID, { status: 'shipped' })
    return {
      code: 200,
      message: 'success',
      data: dataStore.getWarehouseDelivery(deliveryID)
    }
  }

  // 仓库 - 领料单列表
  if (url.includes('/warehouse/picks') && method === 'GET') {
    if (url.match(/\/warehouse\/picks\/(\d+)\/details/)) {
      return {
        code: 200,
        message: 'success',
        data: []
      }
    }
    if (url.includes('/warehouse/picks/production-plans')) {
      const plans = dataStore.getProductionPlans().filter(p => p.status === 'approved')
      return {
        code: 200,
        message: 'success',
        data: plans
      }
    }
    const picks = dataStore.getWarehousePicks()
    return {
      code: 200,
      message: 'success',
      data: {
        list: picks,
        total: picks.length
      }
    }
  }

  // 仓库 - 添加领料单
  if (url.includes('/warehouse/picks') && method === 'POST') {
    const pick = dataStore.addWarehousePick(data)
    return {
      code: 200,
      message: 'success',
      data: pick
    }
  }

  // 仓库 - 审批领料单
  if (url.includes('/warehouse/picks') && url.includes('/approve') && method === 'PUT') {
    const pickID = parseInt(url.match(/\/warehouse\/picks\/(\d+)\/approve/)?.[1] || '0')
    dataStore.updateWarehousePick(pickID, { status: 'completed' })
    return {
      code: 200,
      message: 'success',
      data: dataStore.getWarehousePick(pickID)
    }
  }

  // 仓库 - 退货单列表
  if (url.includes('/warehouse/returns') && method === 'GET') {
    if (url.match(/\/warehouse\/returns\/(\d+)\/details/)) {
      return {
        code: 200,
        message: 'success',
        data: []
      }
    }
    const returns = dataStore.getWarehouseReturns()
    return {
      code: 200,
      message: 'success',
      data: {
        list: returns,
        total: returns.length
      }
    }
  }

  // 仓库 - 添加退货单
  if (url.includes('/warehouse/returns') && method === 'POST') {
    const ret = dataStore.addWarehouseReturn(data)
    return {
      code: 200,
      message: 'success',
      data: ret
    }
  }

  // 仓库 - 审批退货单
  if (url.includes('/warehouse/returns') && url.includes('/approve') && method === 'PUT') {
    const returnID = parseInt(url.match(/\/warehouse\/returns\/(\d+)\/approve/)?.[1] || '0')
    dataStore.updateWarehouseReturn(returnID, { status: 'completed' })
    return {
      code: 200,
      message: 'success',
      data: dataStore.getWarehouseReturn(returnID)
    }
  }

  // 产品 - 产品列表
  if (url.includes('/product/list') && method === 'GET') {
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

  // 生产 - 配方列表
  if (url.includes('/production/recipes') && method === 'GET') {
    if (url.match(/\/production\/recipes\/(\d+)/)) {
      const recipeID = parseInt(url.match(/\/production\/recipes\/(\d+)/)?.[1] || '0')
      const recipe = dataStore.getRecipe(recipeID)
      return {
        code: 200,
        message: 'success',
        data: recipe
      }
    }
    const recipes = dataStore.getRecipes()
    return {
      code: 200,
      message: 'success',
      data: {
        list: recipes,
        total: recipes.length
      }
    }
  }

  // 生产 - 添加配方
  if (url.includes('/production/recipes') && method === 'POST') {
    const recipe = dataStore.addRecipe(data)
    return {
      code: 200,
      message: 'success',
      data: recipe
    }
  }

  // 生产 - 更新配方
  if (url.match(/\/production\/recipes\/(\d+)/) && method === 'PUT') {
    const recipeID = parseInt(url.match(/\/production\/recipes\/(\d+)/)?.[1] || '0')
    dataStore.updateRecipe(recipeID, data)
    return {
      code: 200,
      message: 'success',
      data: dataStore.getRecipe(recipeID)
    }
  }

  // 生产 - 删除配方
  if (url.match(/\/production\/recipes\/(\d+)/) && method === 'DELETE') {
    const recipeID = parseInt(url.match(/\/production\/recipes\/(\d+)/)?.[1] || '0')
    dataStore.deleteRecipe(recipeID)
    return {
      code: 200,
      message: 'success',
      data: null
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
