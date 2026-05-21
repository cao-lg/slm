const Mock = require('mockjs')

const warehouseList = [
  { warehouseID: 1, warehouseCode: 'KCA', warehouseName: 'KCA-车间仓', type: 'workshop', location: 'A区1楼', manager: '张三', status: 1 },
  { warehouseID: 2, warehouseCode: 'KCB', warehouseName: 'KCB-成品仓', type: 'product', location: 'B区1楼', manager: '李四', status: 1 },
  { warehouseID: 3, warehouseCode: 'KCC', warehouseName: 'KCC-材料仓', type: 'material', location: 'C区1楼', manager: '王五', status: 1 },
  { warehouseID: 4, warehouseCode: 'KCD', warehouseName: 'KCD-外仓', type: 'external', location: 'D区1楼', manager: '赵六', status: 1 },
  { warehouseID: 5, warehouseCode: 'KCE', warehouseName: 'KCE-待处理仓', type: 'pending', location: 'E区1楼', manager: '钱七', status: 1 }
]

const productList = [
  { productID: 1, productCode: 'P001', productName: '产品A', unit: '个', spec: '标准', price: 100 },
  { productID: 2, productCode: 'P002', productName: '产品B', unit: '件', spec: '标准', price: 200 },
  { productID: 3, productCode: 'P003', productName: '产品C', unit: '箱', spec: '标准', price: 300 },
  { productID: 4, productCode: 'M001', productName: '原料A', unit: 'kg', spec: '标准', price: 10 },
  { productID: 5, productCode: 'M002', productName: '原料B', unit: 'kg', spec: '标准', price: 20 }
]

const generateInventory = (warehouseId, count = 10) => {
  const result = []
  for (let i = 0; i < count; i++) {
    const product = productList[Math.floor(Math.random() * productList.length)]
    result.push({
      inventoryID: warehouseId * 100 + i,
      warehouseID,
      productID: product.productID,
      productName: product.productName,
      productCode: product.productCode,
      unit: product.unit,
      spec: product.spec,
      quantity: Math.floor(Math.random() * 1000) + 100,
      unitCost: product.price * 0.8,
      location: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 20) + 1}`,
      updateDate: '2024-01-15 10:30:00'
    })
  }
  return result
}

Mock.mock(/\/api\/warehouse\/list/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: warehouseList
  }
})

Mock.mock(/\/api\/warehouse\/\d+\/inventory/, 'get', (options) => {
  const url = options.url
  const match = url.match(/\/api\/warehouse\/(\d+)\/inventory/)
  const warehouseId = match ? parseInt(match[1]) : 1
  
  const inventory = generateInventory(warehouseId, 15)
  return {
    code: 200,
    message: 'success',
    data: {
      list: inventory,
      total: 15
    }
  }
})

Mock.mock('/api/warehouse/inventory/in', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock('/api/warehouse/inventory/out', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/warehouse\/transfers/, 'get', {
  code: 200,
  message: 'success',
  data: {
    list: [
      {
        transferID: 1,
        transferNo: 'DB1704067200001',
        fromWarehouseID: 1,
        fromWarehouseName: 'KCA-车间仓',
        toWarehouseID: 2,
        toWarehouseName: 'KCB-成品仓',
        transferDate: '2024-01-15',
        status: 'completed',
        creator: 'admin',
        createDate: '2024-01-15 10:00:00',
        remark: '生产完成入库'
      },
      {
        transferID: 2,
        transferNo: 'DB1704067200002',
        fromWarehouseID: 3,
        fromWarehouseName: 'KCC-材料仓',
        toWarehouseID: 1,
        toWarehouseName: 'KCA-车间仓',
        transferDate: '2024-01-16',
        status: 'pending',
        creator: 'admin',
        createDate: '2024-01-16 14:00:00',
        remark: '生产领料'
      }
    ],
    total: 2
  }
})

Mock.mock(/\/api\/warehouse\/transfers\/\d+\/details/, 'get', {
  code: 200,
  message: 'success',
  data: [
    { detailID: 1, transferID: 1, productID: 1, productName: '产品A', unit: '个', quantity: 100 },
    { detailID: 2, transferID: 1, productID: 2, productName: '产品B', unit: '件', quantity: 50 }
  ]
})

Mock.mock('/api/warehouse/transfers', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/warehouse\/transfers\/\d+\/approve/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/warehouse\/deliveries/, 'get', {
  code: 200,
  message: 'success',
  data: {
    list: [
      {
        deliveryID: 1,
        deliveryNo: 'FH1704067200001',
        soID: 1,
        orderNo: 'XS1704067200001',
        customerID: 1,
        customerName: '客户A',
        deliveryDate: '2024-01-15',
        status: 'shipped',
        carrier: '顺丰快递',
        trackingNo: 'SF1234567890',
        totalAmount: 15000,
        creator: 'admin',
        createDate: '2024-01-15 09:00:00',
        remark: ''
      },
      {
        deliveryID: 2,
        deliveryNo: 'FH1704067200002',
        soID: 2,
        orderNo: 'XS1704067200002',
        customerID: 2,
        customerName: '客户B',
        deliveryDate: '2024-01-17',
        status: 'pending',
        carrier: '',
        trackingNo: '',
        totalAmount: 20000,
        creator: 'admin',
        createDate: '2024-01-16 11:00:00',
        remark: '等待发货'
      }
    ],
    total: 2
  }
})

Mock.mock(/\/api\/warehouse\/deliveries\/\d+\/details/, 'get', {
  code: 200,
  message: 'success',
  data: [
    { detailID: 1, deliveryID: 1, productID: 1, productName: '产品A', unit: '个', quantity: 100, price: 100, amount: 10000 },
    { detailID: 2, deliveryID: 1, productID: 2, productName: '产品B', unit: '件', quantity: 25, price: 200, amount: 5000 }
  ]
})

Mock.mock('/api/warehouse/deliveries/sales-orders', 'get', {
  code: 200,
  message: 'success',
  data: [
    { soID: 1, orderNo: 'XS1704067200001', customerID: 1, customerName: '客户A', totalAmount: 15000, status: 'approved' },
    { soID: 2, orderNo: 'XS1704067200002', customerID: 2, customerName: '客户B', totalAmount: 20000, status: 'producing' }
  ]
})

Mock.mock(/\/api\/warehouse\/deliveries\/sales-orders\/\d+/, 'get', {
  code: 200,
  message: 'success',
  data: [
    { detailID: 1, soID: 1, productID: 1, productName: '产品A', unit: '个', quantity: 100, price: 100, amount: 10000 },
    { detailID: 2, soID: 1, productID: 2, productName: '产品B', unit: '件', quantity: 25, price: 200, amount: 5000 }
  ]
})

Mock.mock('/api/warehouse/deliveries', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/warehouse\/deliveries\/\d+\/ship/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/warehouse\/picks/, 'get', {
  code: 200,
  message: 'success',
  data: {
    list: [
      {
        pickID: 1,
        pickNo: 'LL1704067200001',
        productionPlanID: 1,
        planNo: 'SC1704067200001',
        warehouseID: 3,
        warehouseName: 'KCC-材料仓',
        pickDate: '2024-01-15',
        status: 'completed',
        picker: '张三',
        createDate: '2024-01-15 08:00:00',
        remark: ''
      },
      {
        pickID: 2,
        pickNo: 'LL1704067200002',
        productionPlanID: 2,
        planNo: 'SC1704067200002',
        warehouseID: 3,
        warehouseName: 'KCC-材料仓',
        pickDate: '2024-01-17',
        status: 'pending',
        picker: '李四',
        createDate: '2024-01-16 15:00:00',
        remark: '生产领料'
      }
    ],
    total: 2
  }
})

Mock.mock(/\/api\/warehouse\/picks\/\d+\/details/, 'get', {
  code: 200,
  message: 'success',
  data: [
    { detailID: 1, pickID: 1, productID: 4, productName: '原料A', unit: 'kg', quantity: 500 },
    { detailID: 2, pickID: 1, productID: 5, productName: '原料B', unit: 'kg', quantity: 300 }
  ]
})

Mock.mock('/api/warehouse/picks/production-plans', 'get', {
  code: 200,
  message: 'success',
  data: [
    { productionPlanID: 1, planNo: 'SC1704067200001', productID: 1, productName: '产品A', plannedQuantity: 1000, status: 'approved' },
    { productionPlanID: 2, planNo: 'SC1704067200002', productID: 2, productName: '产品B', plannedQuantity: 500, status: 'approved' }
  ]
})

Mock.mock('/api/warehouse/picks', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/warehouse\/picks\/\d+\/approve/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/warehouse\/returns/, 'get', {
  code: 200,
  message: 'success',
  data: {
    list: [
      {
        returnID: 1,
        returnNo: 'TH1704067200001',
        sourceType: 2,
        sourceID: 1,
        sourceNo: 'FH1704067200001',
        customerID: 1,
        customerName: '客户A',
        warehouseID: 2,
        warehouseName: 'KCB-成品仓',
        returnDate: '2024-01-20',
        status: 'pending',
        totalAmount: 1000,
        creator: 'admin',
        createDate: '2024-01-19 16:00:00',
        remark: '质量问题退货'
      }
    ],
    total: 1
  }
})

Mock.mock(/\/api\/warehouse\/returns\/\d+\/details/, 'get', {
  code: 200,
  message: 'success',
  data: [
    { detailID: 1, returnID: 1, productID: 1, productName: '产品A', unit: '个', quantity: 10, price: 100, amount: 1000 }
  ]
})

Mock.mock('/api/warehouse/returns', 'post', {
  code: 200,
  message: 'success'
})

Mock.mock(/\/api\/warehouse\/returns\/\d+\/approve/, 'put', {
  code: 200,
  message: 'success'
})

Mock.mock('/api/product/list', 'get', {
  code: 200,
  message: 'success',
  data: {
    list: productList,
    total: productList.length
  }
})

Mock.mock('/api/sales/customers', 'get', {
  code: 200,
  message: 'success',
  data: {
    list: [
      { customerID: 1, customerCode: 'C001', customerName: '客户A', contact: '张经理', phone: '13800138000', status: 1 },
      { customerID: 2, customerCode: 'C002', customerName: '客户B', contact: '李经理', phone: '13800138001', status: 1 },
      { customerID: 3, customerCode: 'C003', customerName: '客户C', contact: '王经理', phone: '13800138002', status: 1 }
    ],
    total: 3
  }
})

module.exports = Mock
