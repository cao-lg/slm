const Mock = require('mockjs')

const userList = [
  { id: 1, userName: 'admin', realName: '管理员', role: 'admin', department: '管理部', position: '系统管理员', email: 'admin@example.com', phone: '13800138001', status: 1, createDate: '2024-01-01 00:00:00', lastLoginDate: '2024-01-20 10:30:00' },
  { id: 2, userName: 'manager', realName: '张经理', role: 'manager', department: '销售部', position: '销售经理', email: 'manager@example.com', phone: '13800138002', status: 1, createDate: '2024-01-05 00:00:00', lastLoginDate: '2024-01-20 09:15:00' },
  { id: 3, userName: 'user01', realName: '张三', role: 'user', department: '销售部', position: '销售员', email: 'user01@example.com', phone: '13800138003', status: 1, createDate: '2024-01-10 00:00:00', lastLoginDate: '2024-01-19 18:20:00' },
  { id: 4, userName: 'user02', realName: '李四', role: 'user', department: '采购部', position: '采购员', email: 'user02@example.com', phone: '13800138004', status: 1, createDate: '2024-01-12 00:00:00', lastLoginDate: '2024-01-20 08:45:00' },
  { id: 5, userName: 'user03', realName: '王五', role: 'user', department: '生产部', position: '生产主管', email: 'user03@example.com', phone: '13800138005', status: 0, createDate: '2024-01-15 00:00:00', lastLoginDate: '2024-01-18 17:30:00' }
]

const messageList = [
  { messageID: 1, title: '系统升级通知', content: '系统将于今晚10点进行升级维护，预计持续2小时。', messageType: 1, senderID: 1, senderName: '管理员', isAll: 1, isRead: 0, publishDate: '2024-01-20 08:00:00', priority: 2, status: 1, createDate: '2024-01-20 08:00:00' },
  { messageID: 2, title: '销售订单待处理', content: '有一笔新的销售订单需要您审批，请及时处理。', messageType: 2, senderID: 2, senderName: '张经理', receiverIDs: '3', receiverNames: '张三', isAll: 0, isRead: 1, publishDate: '2024-01-19 15:30:00', priority: 1, status: 1, createDate: '2024-01-19 15:30:00', readDate: '2024-01-19 16:00:00' },
  { messageID: 3, title: '月度会议通知', content: '请各部门经理于本月25日到会议室参加月度总结会议。', messageType: 3, senderID: 1, senderName: '管理员', isAll: 1, isRead: 1, publishDate: '2024-01-18 10:00:00', priority: 0, status: 1, createDate: '2024-01-18 10:00:00', readDate: '2024-01-18 11:00:00' },
  { messageID: 4, title: '采购入库提醒', content: '有一批原材料已到货，请仓库人员及时入库。', messageType: 2, senderID: 4, senderName: '李四', receiverIDs: '1', receiverNames: '管理员', isAll: 0, isRead: 0, publishDate: '2024-01-20 09:00:00', priority: 1, status: 1, createDate: '2024-01-20 09:00:00' }
]

const systemConfigList = [
  { configID: 1, configKey: 'themeColor', configName: '主题颜色', configValue: '#409eff', configType: 'theme', description: '系统主题颜色', sortOrder: 1, status: 1 },
  { configID: 2, configKey: 'navMode', configName: '导航模式', configValue: 'vertical', configType: 'theme', description: '导航菜单模式', sortOrder: 2, status: 1 },
  { configID: 3, configKey: 'navCollapse', configName: '导航默认折叠', configValue: 'true', configType: 'theme', description: '侧边导航是否默认折叠', sortOrder: 3, status: 1 },
  { configID: 4, configKey: 'showLogo', configName: '显示Logo', configValue: 'true', configType: 'theme', description: '是否显示系统Logo', sortOrder: 4, status: 1 },
  { configID: 5, configKey: 'pageSize', configName: '默认分页大小', configValue: '20', configType: 'display', description: '列表默认每页显示条数', sortOrder: 5, status: 1 },
  { configID: 6, configKey: 'language', configName: '系统语言', configValue: 'zh-CN', configType: 'display', description: '系统界面语言', sortOrder: 6, status: 1 },
  { configID: 7, configKey: 'dateFormat', configName: '日期格式', configValue: 'YYYY-MM-DD HH:mm:ss', configType: 'display', description: '日期时间显示格式', sortOrder: 7, status: 1 }
]

const operationLogList = [
  { logID: 1, module: 'user', operationType: '登录', operationDesc: '用户登录系统', operatorID: 1, operatorName: '管理员', requestMethod: 'POST', requestUrl: '/api/auth/login', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', executionTime: 120, isSuccess: 1, operateDate: '2024-01-20 10:30:00' },
  { logID: 2, module: 'order', operationType: '新增', operationDesc: '创建销售订单 XS1704067200003', operatorID: 3, operatorName: '张三', requestMethod: 'POST', requestUrl: '/api/sales/order', requestParams: '{"customerID":1,"totalAmount":15000}', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0', executionTime: 85, isSuccess: 1, operateDate: '2024-01-20 10:25:00' },
  { logID: 3, module: 'warehouse', operationType: '编辑', operationDesc: '更新库存数量', operatorID: 1, operatorName: '管理员', requestMethod: 'PUT', requestUrl: '/api/warehouse/inventory', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', executionTime: 65, isSuccess: 1, operateDate: '2024-01-20 09:45:00' },
  { logID: 4, module: 'product', operationType: '新增', operationDesc: '添加新产品', operatorID: 1, operatorName: '管理员', requestMethod: 'POST', requestUrl: '/api/product', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', executionTime: 95, isSuccess: 1, operateDate: '2024-01-19 16:30:00' },
  { logID: 5, module: 'system', operationType: '编辑', operationDesc: '修改系统配置', operatorID: 1, operatorName: '管理员', requestMethod: 'PUT', requestUrl: '/api/system/config', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0', executionTime: 50, isSuccess: 1, operateDate: '2024-01-19 14:20:00' },
  { logID: 6, module: 'customer', operationType: '删除', operationDesc: '删除客户信息', operatorID: 2, operatorName: '张经理', requestMethod: 'DELETE', requestUrl: '/api/sales/customer/5', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0', executionTime: 30, isSuccess: 0, errorMessage: '该客户有关联订单，无法删除', operateDate: '2024-01-19 11:15:00' },
  { logID: 7, module: 'finance', operationType: '新增', operationDesc: '创建收款记录', operatorID: 2, operatorName: '张经理', requestMethod: 'POST', requestUrl: '/api/finance/receivable', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0', executionTime: 78, isSuccess: 1, operateDate: '2024-01-18 15:40:00' },
  { logID: 8, module: 'user', operationType: '登出', operationDesc: '用户退出系统', operatorID: 3, operatorName: '张三', requestMethod: 'POST', requestUrl: '/api/auth/logout', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0', executionTime: 15, isSuccess: 1, operateDate: '2024-01-18 18:20:00' }
]

Mock.mock(/\/api\/system\/user\/list/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = userList.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: userList.length,
      page,
      pageSize
    }
  }
})

Mock.mock(/\/api\/system\/user\/detail/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const id = parseInt(params.get('id'))
  const user = userList.find(u => u.id === id)
  
  return {
    code: 200,
    message: 'success',
    data: user || null
  }
})

Mock.mock('/api/system/user/add', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock('/api/system/user/update', 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/user\/delete/, 'delete', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/user\/status/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock('/api/system/user/change-password', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/user\/reset-password/, 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/message\/list/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = messageList.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: messageList.length,
      page,
      pageSize
    }
  }
})

Mock.mock(/\/api\/system\/message\/unread/, 'get', {
  code: 200,
  message: 'success',
  data: messageList.filter(m => m.isRead === 0)
})

Mock.mock(/\/api\/system\/message\/detail/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const messageID = parseInt(params.get('messageID'))
  const message = messageList.find(m => m.messageID === messageID)
  
  return {
    code: 200,
    message: 'success',
    data: message || null
  }
})

Mock.mock('/api/system/message/publish', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/message\/mark-read/, 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/message\/mark-all-read/, 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/message\/delete/, 'delete', {
  code: 200,
  message: 'success'
})

Mock.mock('/api/system/config/list', 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const configType = params.get('configType')
  
  let list = systemConfigList
  if (configType) {
    list = systemConfigList.filter(c => c.configType === configType)
  }
  
  return {
    code: 200,
    message: 'success',
    data: list
  }
})

Mock.mock('/api/system/config/map', 'get', {
  code: 200,
  message: 'success',
  data: {
    themeColor: '#409eff',
    navMode: 'vertical',
    navCollapse: 'true',
    showLogo: 'true',
    pageSize: '20',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD HH:mm:ss'
  }
})

Mock.mock(/\/api\/system\/config\/value/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const configKey = params.get('configKey')
  const config = systemConfigList.find(c => c.configKey === configKey)
  
  return {
    code: 200,
    message: 'success',
    data: config ? config.configValue : ''
  }
})

Mock.mock('/api/system/config/update', 'put', {
  code: 200,
  message: 'success'
})

Mock.mock('/api/system/config/batch-update', 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/config\/delete/, 'delete', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/system\/log\/list/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = operationLogList.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: operationLogList.length,
      page,
      pageSize
    }
  }
})

Mock.mock(/\/api\/system\/log\/detail/, 'get', (options) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const logID = parseInt(params.get('logID'))
  const log = operationLogList.find(l => l.logID === logID)
  
  return {
    code: 200,
    message: 'success',
    data: log || null
  }
})

Mock.mock('/api/system/log/stats', 'get', {
  code: 200,
  message: 'success',
  data: {
    total: operationLogList.length,
    today: 5
  }
})

Mock.mock(/\/api\/system\/log\/delete/, 'delete', {
  code: 200,
  message: 'success'
})

Mock.mock('/api/system/log/clear', 'delete', {
  code: 200,
  message: 'success'
})

module.exports = Mock
