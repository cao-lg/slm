const Mock = require('mockjs')

const receivableList = [
  {
    receivableID: 1,
    receivableNo: 'AR1704067200001',
    customerID: 1,
    customerName: '客户A',
    salesOrderID: 1,
    salesOrderNo: 'XS1704067200001',
    totalAmount: 15000,
    receivedAmount: 10000,
    pendingAmount: 5000,
    dueDate: '2024-02-15',
    status: 'partial',
    remark: '',
    creator: 'admin',
    createDate: '2024-01-15 10:00:00'
  },
  {
    receivableID: 2,
    receivableNo: 'AR1704067200002',
    customerID: 2,
    customerName: '客户B',
    salesOrderID: 2,
    salesOrderNo: 'XS1704067200002',
    totalAmount: 20000,
    receivedAmount: 20000,
    pendingAmount: 0,
    dueDate: '2024-02-20',
    status: 'completed',
    remark: '',
    creator: 'admin',
    createDate: '2024-01-16 14:00:00'
  },
  {
    receivableID: 3,
    receivableNo: 'AR1704067200003',
    customerID: 3,
    customerName: '客户C',
    salesOrderID: 3,
    salesOrderNo: 'XS1704067200003',
    totalAmount: 8000,
    receivedAmount: 0,
    pendingAmount: 8000,
    dueDate: '2024-03-01',
    status: 'pending',
    remark: '新订单',
    creator: 'admin',
    createDate: '2024-01-18 09:00:00'
  }
]

const payableList = [
  {
    payableID: 1,
    payableNo: 'AP1704067200001',
    supplierID: 1,
    supplierName: '供应商A',
    purchaseOrderID: 1,
    purchaseOrderNo: 'CG1704067200001',
    totalAmount: 50000,
    paidAmount: 30000,
    pendingAmount: 20000,
    dueDate: '2024-02-10',
    status: 'partial',
    remark: '',
    creator: 'admin',
    createDate: '2024-01-10 08:00:00'
  },
  {
    payableID: 2,
    payableNo: 'AP1704067200002',
    supplierID: 2,
    supplierName: '供应商B',
    purchaseOrderID: 2,
    purchaseOrderNo: 'CG1704067200002',
    totalAmount: 30000,
    paidAmount: 0,
    pendingAmount: 30000,
    dueDate: '2024-03-15',
    status: 'pending',
    remark: '原材料采购',
    creator: 'admin',
    createDate: '2024-01-15 10:00:00'
  },
  {
    payableID: 3,
    payableNo: 'AP1704067200003',
    supplierID: 3,
    supplierName: '供应商C',
    purchaseOrderID: 3,
    purchaseOrderNo: 'CG1704067200003',
    totalAmount: 15000,
    paidAmount: 15000,
    pendingAmount: 0,
    dueDate: '2024-01-30',
    status: 'completed',
    remark: '',
    creator: 'admin',
    createDate: '2024-01-05 14:00:00'
  }
]

const expenseList = [
  {
    expenseID: 1,
    expenseNo: 'EX1704067200001',
    applicantID: 1,
    applicantName: '张三',
    department: '销售部',
    amount: 1500,
    category: '差旅费',
    description: '北京出差三天，拜访客户',
    status: 'approved',
    approverID: 2,
    approverName: '李经理',
    approveDate: '2024-01-18',
    approveRemark: '同意报销',
    remark: '',
    createDate: '2024-01-15 10:00:00'
  },
  {
    expenseID: 2,
    expenseNo: 'EX1704067200002',
    applicantID: 2,
    applicantName: '李四',
    department: '市场部',
    amount: 800,
    category: '招待费',
    description: '客户招待费用',
    status: 'pending',
    approverID: null,
    approverName: null,
    approveDate: null,
    approveRemark: null,
    remark: '',
    createDate: '2024-01-19 14:00:00'
  },
  {
    expenseID: 3,
    expenseNo: 'EX1704067200003',
    applicantID: 3,
    applicantName: '王五',
    department: '研发部',
    amount: 2000,
    category: '培训费',
    description: '技术培训课程费用',
    status: 'rejected',
    approverID: 2,
    approverName: '李经理',
    approveDate: '2024-01-20',
    approveRemark: '培训内容与工作无关',
    remark: '',
    createDate: '2024-01-17 09:00:00'
  }
]

Mock.mock(/\/api\/finance\/receivables/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const page = parseInt(params.get('page') || '1')
  const pageSize = parseInt(params.get('pageSize') || '10')
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = receivableList.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: receivableList.length
    }
  }
})

Mock.mock(/\/api\/finance\/receivables\/\d+/, 'get', (options) => {
  const url = options.url
  const match = url.match(/\/api\/finance\/receivables\/(\d+)/)
  const id = match ? parseInt(match[1]) : 1
  const receivable = receivableList.find(r => r.receivableID === id)
  
  return {
    code: 200,
    message: 'success',
    data: receivable || null
  }
})

Mock.mock('/api/finance/receivables', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/receivables\/\d+/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/receivables\/\d+/, 'delete', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/receivables\/\d+\/verify/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/payables/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const page = parseInt(params.get('page') || '1')
  const pageSize = parseInt(params.get('pageSize') || '10')
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = payableList.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: payableList.length
    }
  }
})

Mock.mock(/\/api\/finance\/payables\/\d+/, 'get', (options) => {
  const url = options.url
  const match = url.match(/\/api\/finance\/payables\/(\d+)/)
  const id = match ? parseInt(match[1]) : 1
  const payable = payableList.find(p => p.payableID === id)
  
  return {
    code: 200,
    message: 'success',
    data: payable || null
  }
})

Mock.mock('/api/finance/payables', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/payables\/\d+/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/payables\/\d+/, 'delete', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/payables\/\d+\/verify/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/expenses/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const page = parseInt(params.get('page') || '1')
  const pageSize = parseInt(params.get('pageSize') || '10')
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = expenseList.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: expenseList.length
    }
  }
})

Mock.mock(/\/api\/finance\/expenses\/\d+/, 'get', (options) => {
  const url = options.url
  const match = url.match(/\/api\/finance\/expenses\/(\d+)/)
  const id = match ? parseInt(match[1]) : 1
  const expense = expenseList.find(e => e.expenseID === id)
  
  return {
    code: 200,
    message: 'success',
    data: expense || null
  }
})

Mock.mock('/api/finance/expenses', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/expenses\/\d+/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/expenses\/\d+/, 'delete', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/expenses\/\d+\/approve/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/finance\/expenses\/\d+\/reject/, 'put', {
  code: 200,
  message: 'success'
})

module.exports = Mock
