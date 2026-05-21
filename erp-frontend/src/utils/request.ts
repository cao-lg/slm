import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './storage'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  adapter: (config) => {
    return new Promise((resolve) => {
      let url = config.url || ''
      if (url.startsWith('/api')) {
        url = url.substring(4)
      }
      
      const mockKey = Object.keys(mockData).find(key => url.includes(key))
      
      if (mockKey) {
        console.log('使用Mock数据:', mockKey)
        let responseData = mockData[mockKey]
        
        if (config.method === 'post' && url.includes('/warehouse/deliveries')) {
          const deliveryID = Math.floor(Math.random() * 10000) + 100
          const now = new Date()
          const deliveryNo = `FH${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(deliveryID).padStart(3, '0')}`
          
          responseData = {
            code: 200,
            message: 'success',
            data: {
              deliveryID,
              deliveryNo,
              status: 'pending'
            }
          }
        }
        
        if (config.method === 'post' && url.includes('/warehouse/picks')) {
          const pickID = Math.floor(Math.random() * 10000) + 100
          const now = new Date()
          const pickNo = `LL${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(pickID).padStart(3, '0')}`

          responseData = {
            code: 200,
            message: 'success',
            data: {
              pickID,
              pickNo,
              status: 'pending'
            }
          }
        }

        if (config.method === 'put' && url.includes('/warehouse/picks') && url.includes('/approve')) {
          responseData = {
            code: 200,
            message: 'success',
            data: {
              success: true,
              message: '领料单已审核，库存已更新'
            }
          }
        }

        if (config.method === 'post' && url.includes('/warehouse/transfers')) {
          const transferID = Math.floor(Math.random() * 10000) + 100
          const now = new Date()
          const transferNo = `TP${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(transferID).padStart(3, '0')}`

          responseData = {
            code: 200,
            message: 'success',
            data: {
              transferID,
              transferNo,
              status: 'pending'
            }
          }
        }

        if (config.method === 'put' && url.includes('/warehouse/transfers') && url.includes('/approve')) {
          responseData = {
            code: 200,
            message: 'success',
            data: {
              success: true,
              message: '调拨单已审核，库存已更新',
              fromWarehouse: '车间仓',
              toWarehouse: '成品仓',
              inventoryChanges: [
                { productName: 'A型配件', fromQuantity: 10, toQuantity: 10 }
              ]
            }
          }
        }

        if (config.method === 'put' && url.includes('/receivables') && url.includes('/verify')) {
          const receivableID = parseInt(url.match(/\/receivables\/(\d+)\/verify/)?.[1] || '0')
          const params = config.params || {}
          const amount = parseFloat(params.amount) || 0
          const paymentDate = params.paymentDate || new Date().toISOString().split('T')[0]
          const paymentMethod = params.paymentMethod || 'transfer'
          const remark = params.remark || ''
          
          const receivableMap: Record<number, any> = {
            1: { totalAmount: 5000.00, receivedAmount: 3000.00 },
            2: { totalAmount: 8000.00, receivedAmount: 0.00 },
            3: { totalAmount: 12000.00, receivedAmount: 12000.00 },
            4: { totalAmount: 3000.00, receivedAmount: 0.00 }
          }
          
          const receivable = receivableMap[receivableID] || { totalAmount: 0, receivedAmount: 0 }
          const newReceivedAmount = receivable.receivedAmount + amount
          const newPendingAmount = receivable.totalAmount - newReceivedAmount
          const newStatus = newPendingAmount <= 0 ? 'paid' : (newReceivedAmount > 0 ? 'partial' : 'unpaid')
          
          responseData = {
            code: 200,
            message: 'success',
            data: {
              receivableID,
              receivedAmount: newReceivedAmount,
              pendingAmount: Math.max(0, newPendingAmount),
              status: newStatus,
              paymentDate,
              paymentMethod,
              remark
            }
          }
        }

        if (config.method === 'put' && url.includes('/payables') && url.includes('/verify')) {
          const payableID = parseInt(url.match(/\/payables\/(\d+)\/verify/)?.[1] || '0')
          const params = config.params || {}
          const amount = parseFloat(params.amount) || 0
          const remark = params.remark || ''
          
          const payableMap: Record<number, any> = {
            1: { totalAmount: 5000.00, paidAmount: 2000.00 },
            2: { totalAmount: 8000.00, paidAmount: 0.00 },
            3: { totalAmount: 12000.00, paidAmount: 12000.00 },
            4: { totalAmount: 3500.00, paidAmount: 0.00 },
            5: { totalAmount: 4500.00, paidAmount: 1500.00 }
          }
          
          const payable = payableMap[payableID] || { totalAmount: 0, paidAmount: 0 }
          const newPaidAmount = payable.paidAmount + amount
          const newPendingAmount = payable.totalAmount - newPaidAmount
          const newStatus = newPendingAmount <= 0 ? 'paid' : (newPaidAmount > 0 ? 'partial' : 'unpaid')
          
          responseData = {
            code: 200,
            message: 'success',
            data: {
              payableID,
              paidAmount: newPaidAmount,
              pendingAmount: Math.max(0, newPendingAmount),
              status: newStatus,
              remark
            }
          }
        }
        
        if (config.method === 'post' && url.includes('/warehouse/picks/inventory-out')) {
          responseData = {
            code: 200,
            message: 'success',
            data: {
              success: true,
              message: '库存已扣减',
              warehouseID: 3,
              warehouseName: '材料仓'
            }
          }
        }

        if (config.method === 'post' && url.includes('/warehouse/returns/inventory-in')) {
          const returnID = Math.floor(Math.random() * 10000) + 100
          const now = new Date()
          const returnNo = `TH${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(returnID).padStart(3, '0')}`

          responseData = {
            code: 200,
            message: 'success',
            data: {
              returnID,
              returnNo,
              status: 'pending',
              warehouseID: 5,
              warehouseName: '待处理仓'
            }
          }
        }

        if (config.method === 'put' && url.includes('/warehouse/returns') && url.includes('/approve')) {
          responseData = {
            code: 200,
            message: 'success',
            data: {
              success: true,
              message: '退货单已审核，库存已更新'
            }
          }
        }
        
        resolve({
          data: responseData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config
        })
      } else {
        console.warn('没有找到Mock数据:', url)
        resolve({
          data: { code: 200, message: 'success', data: null },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config
        })
      }
    })
  }
})

// Mock数据
const mockData: Record<string, any> = {
  '/auth/login': {
    code: 200,
    message: 'success',
    data: {
      token: 'mock-token-123456',
      userInfo: {
        userId: 1,
        username: 'CLG',
        realName: '陈立国',
        role: 'admin',
        department: '系统管理'
      }
    }
  },
  '/auth/userinfo': {
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
  },
  '/auth/logout': {
    code: 200,
    message: 'success',
    data: null
  },
  '/sales/customers': {
    code: 200,
    message: 'success',
    data: {
      list: [
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
      total: 3
    }
  },
  '/sales/quotations': {
    code: 200,
    message: 'success',
    data: {
      list: [
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
        },
        {
          quotationID: 3,
          quotationNo: 'BJ202505200003',
          customerID: 3,
          customerName: '广州电子科技',
          quotationDate: '2025-05-15',
          validUntil: '2025-06-15',
          totalAmount: 12000.00,
          status: 'rejected',
          creator: '陈立国'
        }
      ],
      total: 3
    }
  },
  '/sales/quotations/1': {
    code: 200,
    message: 'success',
    data: {
      quotationID: 1,
      quotationNo: 'BJ202505200001',
      customerID: 1,
      customerName: '北京科技有限公司',
      quotationDate: '2025-05-20',
      validUntil: '2025-06-20',
      totalAmount: 5000.00,
      status: 'accepted',
      creator: '陈立国'
    }
  },
  '/sales/quotations/2': {
    code: 200,
    message: 'success',
    data: {
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
  },
  '/sales/quotations/3': {
    code: 200,
    message: 'success',
    data: {
      quotationID: 3,
      quotationNo: 'BJ202505200003',
      customerID: 3,
      customerName: '广州电子科技',
      quotationDate: '2025-05-15',
      validUntil: '2025-06-15',
      totalAmount: 12000.00,
      status: 'rejected',
      creator: '陈立国'
    }
  },
  '/sales/quotations/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        quotationID: 1,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 50,
        unitPrice: 100.00,
        amount: 5000.00
      }
    ]
  },
  '/sales/quotations/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 2,
        quotationID: 2,
        productID: 2,
        productName: 'B型组件',
        unit: '套',
        quantity: 40,
        unitPrice: 200.00,
        amount: 8000.00
      }
    ]
  },
  '/sales/quotations/3/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 3,
        quotationID: 3,
        productID: 3,
        productName: 'C型零件',
        unit: '件',
        quantity: 240,
        unitPrice: 50.00,
        amount: 12000.00
      }
    ]
  },
  '/sales/orders/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        soID: 1,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 50,
        deliveredQuantity: 20,
        price: 100,
        amount: 5000
      }
    ]
  },
  '/sales/orders/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 2,
        soID: 2,
        productID: 2,
        productName: 'B型组件',
        unit: '套',
        quantity: 40,
        deliveredQuantity: 0,
        price: 200,
        amount: 8000
      }
    ]
  },
  '/sales/orders/3/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 3,
        soID: 3,
        productID: 3,
        productName: 'C型零件',
        unit: '件',
        quantity: 240,
        deliveredQuantity: 100,
        price: 50,
        amount: 12000
      }
    ]
  },
  '/sales/quotations/1/convert': {
    code: 200,
    message: 'success',
    data: {
      orderID: 4,
      orderNo: 'XS202505210001'
    }
  },
  '/sales/orders': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          orderID: 1,
          orderNo: 'XS202505200001',
          customerID: 1,
          customerName: '北京科技有限公司',
          orderDate: '2025-05-20',
          deliveryDate: '2025-05-30',
          totalAmount: 5000.00,
          status: 'approved',
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
      total: 3
    }
  },
  '/purchase/suppliers': {
    code: 200,
    message: 'success',
    data: {
      list: [
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
      total: 3
    }
  },
  '/purchase/orders': {
    code: 200,
    message: 'success',
    data: {
      list: [
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
        },
        {
          poID: 3,
          poNo: 'CG202505200003',
          supplierID: 1,
          supplierName: '深圳材料厂',
          orderDate: '2025-05-15',
          deliveryDate: '2025-05-25',
          totalAmount: 12000.00,
          status: 'received',
          creator: '陈立国'
        }
      ],
      total: 3
    }
  },
  '/purchase/orders/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        poID: 1,
        materialID: 1,
        materialName: '乳液',
        unit: 'kg',
        quantity: 300,
        unitPrice: 10.00,
        amount: 3000.00,
        supplierProductCode: 'MA292',
        supplierProductName: '乳液'
      },
      {
        detailID: 2,
        poID: 1,
        materialID: 2,
        materialName: '金属棒',
        unit: '根',
        quantity: 80,
        unitPrice: 25.00,
        amount: 2000.00,
        supplierProductCode: 'JSL50',
        supplierProductName: '金属棒'
      }
    ]
  },
  '/purchase/orders/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 3,
        poID: 2,
        materialID: 3,
        materialName: '螺丝螺母',
        unit: '套',
        quantity: 10000,
        unitPrice: 0.50,
        amount: 5000.00,
        supplierProductCode: 'LM8',
        supplierProductName: '螺丝螺母M8'
      },
      {
        detailID: 4,
        poID: 2,
        materialID: 4,
        materialName: '橡胶垫片',
        unit: '片',
        quantity: 15000,
        unitPrice: 0.20,
        amount: 3000.00,
        supplierProductCode: 'XJ5',
        supplierProductName: '橡胶垫片5mm'
      }
    ]
  },
  '/purchase/orders/3/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 5,
        poID: 3,
        materialID: 1,
        materialName: '乳液',
        unit: 'kg',
        quantity: 800,
        unitPrice: 11.00,
        amount: 8800.00,
        supplierProductCode: 'MA292',
        supplierProductName: '乳液'
      },
      {
        detailID: 6,
        poID: 3,
        materialID: 2,
        materialName: '金属棒',
        unit: '根',
        quantity: 128,
        unitPrice: 25.00,
        amount: 3200.00,
        supplierProductCode: 'JSL50',
        supplierProductName: '金属棒'
      }
    ]
  },
  '/purchase/materials': {
    code: 200,
    message: 'success',
    data: {
      list: [
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
      total: 4
    }
  },
  '/purchase/materials/1/suppliers': {
    code: 200,
    message: 'success',
    data: [
      {
        id: 1,
        materialID: 1,
        supplierID: 1,
        supplierCode: 'HS01103',
        supplierName: '果山环保',
        supplierProductCode: 'MA292',
        supplierProductName: '乳液',
        purchasePrice: 10,
        status: 1
      },
      {
        id: 2,
        materialID: 1,
        supplierID: 2,
        supplierCode: 'HS01105',
        supplierName: '德堡新材',
        supplierProductCode: 'MA292',
        supplierProductName: '乳液',
        purchasePrice: 11,
        status: 1
      }
    ]
  },
  '/purchase/materials/2/suppliers': {
    code: 200,
    message: 'success',
    data: []
  },
  '/purchase/materials/3/suppliers': {
    code: 200,
    message: 'success',
    data: []
  },
  '/purchase/materials/4/suppliers': {
    code: 200,
    message: 'success',
    data: []
  },
  '/product/products': {
    code: 200,
    message: 'success',
    data: {
      list: [
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
      total: 3
    }
  },
  '/production/plans': {
    code: 200,
    message: 'success',
    data: {
      list: [
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
      total: 3
    }
  },
  '/production/plans/1': {
    code: 200,
    message: 'success',
    data: {
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
      updateDate: '2025-05-21 10:00:00',
      creator: '陈立国'
    }
  },
  '/production/plans/2': {
    code: 200,
    message: 'success',
    data: {
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
      updateDate: '2025-05-18 10:00:00',
      creator: '陈立国'
    }
  },
  '/production/plans/3': {
    code: 200,
    message: 'success',
    data: {
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
      updateDate: '2025-05-25 17:00:00',
      creator: '陈立国'
    }
  },
  '/production/recipes': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          recipeId: 1,
          recipeCode: 'PF202505200001',
          recipeName: 'A型配件配方',
          productId: 1,
          productName: 'A型配件',
          version: '1.0',
          status: 1,
          createDate: '2025-05-20',
          creator: '陈立国',
          materials: [
            {
              id: 1,
              recipeId: 1,
              materialIdRef: 1,
              materialName: '乳液',
              unit: 'kg',
              quantity: 0.5,
              wasteRate: 5,
              unitPrice: 10
            },
            {
              id: 2,
              recipeId: 1,
              materialIdRef: 2,
              materialName: '金属棒',
              unit: '根',
              quantity: 2,
              wasteRate: 2,
              unitPrice: 25
            }
          ]
        },
        {
          recipeId: 2,
          recipeCode: 'PF202505200002',
          recipeName: 'B型组件配方',
          productId: 2,
          productName: 'B型组件',
          version: '1.0',
          status: 1,
          createDate: '2025-05-18',
          creator: '陈立国',
          materials: [
            {
              id: 3,
              recipeId: 2,
              materialIdRef: 1,
              materialName: '乳液',
              unit: 'kg',
              quantity: 0.8,
              wasteRate: 3,
              unitPrice: 10
            },
            {
              id: 4,
              recipeId: 2,
              materialIdRef: 3,
              materialName: '螺丝螺母',
              unit: '套',
              quantity: 10,
              wasteRate: 1,
              unitPrice: 0.5
            }
          ]
        }
      ],
      total: 2
    }
  },
  '/production/recipes/1': {
    code: 200,
    message: 'success',
    data: {
      recipeId: 1,
      recipeCode: 'PF202505200001',
      recipeName: 'A型配件配方',
      productId: 1,
      productName: 'A型配件',
      version: '1.0',
      status: 1,
      createDate: '2025-05-20',
      creator: '陈立国'
    }
  },
  '/production/recipes/2': {
    code: 200,
    message: 'success',
    data: {
      recipeId: 2,
      recipeCode: 'PF202505200002',
      recipeName: 'B型组件配方',
      productId: 2,
      productName: 'B型组件',
      version: '1.0',
      status: 1,
      createDate: '2025-05-18',
      creator: '陈立国'
    }
  },
  '/production/recipes/1/materials': {
    code: 200,
    message: 'success',
    data: [
      {
        id: 1,
        recipeId: 1,
        materialIdRef: 1,
        materialName: '乳液',
        unit: 'kg',
        quantity: 0.5,
        wasteRate: 5,
        unitPrice: 10
      },
      {
        id: 2,
        recipeId: 1,
        materialIdRef: 2,
        materialName: '金属棒',
        unit: '根',
        quantity: 2,
        wasteRate: 2,
        unitPrice: 25
      }
    ]
  },
  '/production/recipes/2/materials': {
    code: 200,
    message: 'success',
    data: [
      {
        id: 3,
        recipeId: 2,
        materialIdRef: 1,
        materialName: '乳液',
        unit: 'kg',
        quantity: 0.8,
        wasteRate: 3,
        unitPrice: 10
      },
      {
        id: 4,
        recipeId: 2,
        materialIdRef: 3,
        materialName: '螺丝螺母',
        unit: '套',
        quantity: 10,
        wasteRate: 1,
        unitPrice: 0.5
      }
    ]
  },
  '/warehouse/workshop': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          inventoryID: 1,
          warehouseID: 1,
          warehouseName: '车间仓',
          productID: 1,
          productCode: 'CP202505200001',
          productName: 'A型配件',
          quantity: 100,
          unitCost: 50.00
        },
        {
          inventoryID: 2,
          warehouseID: 1,
          warehouseName: '车间仓',
          productID: 2,
          productCode: 'CP202505200002',
          productName: 'B型组件',
          quantity: 50,
          unitCost: 100.00
        }
      ],
      total: 2
    }
  },
  '/warehouse/product': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          inventoryID: 3,
          warehouseID: 2,
          warehouseName: '成品仓',
          productID: 1,
          productCode: 'CP202505200001',
          productName: 'A型配件',
          quantity: 200,
          unitCost: 50.00
        }
      ],
      total: 1
    }
  },
  '/finance/receivables': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          receivableID: 1,
          receivableNo: 'YS202505200001',
          customerID: 1,
          customerName: '北京科技有限公司',
          salesOrderID: 1,
          salesOrderNo: 'XS202505200001',
          totalAmount: 5000.00,
          receivedAmount: 3000.00,
          pendingAmount: 2000.00,
          status: 'partial',
          dueDate: '2025-05-30',
          creator: '陈立国',
          createDate: '2025-05-20'
        },
        {
          receivableID: 2,
          receivableNo: 'YS202505200002',
          customerID: 2,
          customerName: '上海商贸集团',
          salesOrderID: 2,
          salesOrderNo: 'XS202505200002',
          totalAmount: 8000.00,
          receivedAmount: 0.00,
          pendingAmount: 8000.00,
          status: 'unpaid',
          dueDate: '2025-05-28',
          creator: '陈立国',
          createDate: '2025-05-18'
        },
        {
          receivableID: 3,
          receivableNo: 'YS202505150003',
          customerID: 3,
          customerName: '广州电子科技',
          salesOrderID: 3,
          salesOrderNo: 'XS202505200003',
          totalAmount: 12000.00,
          receivedAmount: 12000.00,
          pendingAmount: 0.00,
          status: 'paid',
          dueDate: '2025-05-25',
          creator: '陈立国',
          createDate: '2025-05-15'
        },
        {
          receivableID: 4,
          receivableNo: 'YS202505210001',
          customerID: 1,
          customerName: '北京科技有限公司',
          salesOrderID: 1,
          salesOrderNo: 'XS202505200001',
          totalAmount: 3000.00,
          receivedAmount: 0.00,
          pendingAmount: 3000.00,
          status: 'unpaid',
          dueDate: '2025-06-01',
          creator: '陈立国',
          createDate: '2025-05-21'
        }
      ],
      total: 4
    }
  },
  '/finance/payables': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          payableID: 1,
          payableNo: 'YF202505200001',
          supplierID: 1,
          supplierName: '深圳材料厂',
          purchaseOrderID: 1,
          purchaseOrderNo: 'CG202505200001',
          totalAmount: 5000.00,
          paidAmount: 2000.00,
          pendingAmount: 3000.00,
          status: 'partial',
          dueDate: '2025-05-30',
          creator: '陈立国',
          createDate: '2025-05-20'
        },
        {
          payableID: 2,
          payableNo: 'YF202505200002',
          supplierID: 2,
          supplierName: '杭州化工公司',
          purchaseOrderID: 2,
          purchaseOrderNo: 'CG202505200002',
          totalAmount: 8000.00,
          paidAmount: 0.00,
          pendingAmount: 8000.00,
          status: 'unpaid',
          dueDate: '2025-05-28',
          creator: '陈立国',
          createDate: '2025-05-18'
        },
        {
          payableID: 3,
          payableNo: 'YF202505150003',
          supplierID: 3,
          supplierName: '果山环保',
          purchaseOrderID: 3,
          purchaseOrderNo: 'CG202505200003',
          totalAmount: 12000.00,
          paidAmount: 12000.00,
          pendingAmount: 0.00,
          status: 'paid',
          dueDate: '2025-05-25',
          creator: '陈立国',
          createDate: '2025-05-15'
        },
        {
          payableID: 4,
          payableNo: 'YF202505210001',
          supplierID: 1,
          supplierName: '果山环保',
          purchaseOrderID: 1,
          purchaseOrderNo: 'CG202505210001',
          totalAmount: 3500.00,
          paidAmount: 0.00,
          pendingAmount: 3500.00,
          status: 'unpaid',
          dueDate: '2025-06-05',
          creator: '陈立国',
          createDate: '2025-05-21'
        },
        {
          payableID: 5,
          payableNo: 'YF202505210002',
          supplierID: 2,
          supplierName: '德堡新材',
          purchaseOrderID: 2,
          purchaseOrderNo: 'CG202505210002',
          totalAmount: 4500.00,
          paidAmount: 1500.00,
          pendingAmount: 3000.00,
          status: 'partial',
          dueDate: '2025-06-10',
          creator: '陈立国',
          createDate: '2025-05-21'
        }
      ],
      total: 5
    }
  },
  '/finance/expenses': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          expenseID: 1,
          expenseNo: 'BX202505200001',
          applicant: '陈立国',
          department: '销售部',
          category: '差旅费',
          amount: 1500.00,
          status: 'approved',
          createDate: '2025-05-18'
        },
        {
          expenseID: 2,
          expenseNo: 'BX202505200002',
          applicant: '张三',
          department: '市场部',
          category: '交通费',
          amount: 500.00,
          status: 'pending',
          createDate: '2025-05-20'
        }
      ],
      total: 2
    }
  },
  '/system/users': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          userID: 1,
          username: 'CLG',
          realName: '陈立国',
          role: 'admin',
          department: '系统管理',
          status: 1
        },
        {
          userID: 2,
          username: 'zhangsan',
          realName: '张三',
          role: 'user',
          department: '销售部',
          status: 1
        }
      ],
      total: 2
    }
  },
  '/system/messages': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          messageID: 1,
          title: '系统升级通知',
          content: '系统将于本周六进行升级维护',
          type: 'system',
          priority: 'important',
          isRead: false,
          createDate: '2025-05-20'
        },
        {
          messageID: 2,
          title: '新订单提醒',
          content: '您有一笔新订单待处理',
          type: 'business',
          priority: 'normal',
          isRead: true,
          createDate: '2025-05-19'
        }
      ],
      total: 2
    }
  },
  '/warehouse/list': {
    code: 200,
    message: 'success',
    data: [
      { warehouseID: 1, warehouseCode: 'KCA', warehouseName: '车间仓', type: 'production', manager: '陈立国', status: 1, createDate: '2025-01-01' },
      { warehouseID: 2, warehouseCode: 'KCB', warehouseName: '成品仓', type: 'finished', manager: '张三', status: 1, createDate: '2025-01-01' },
      { warehouseID: 3, warehouseCode: 'KCC', warehouseName: '材料仓', type: 'material', manager: '李四', status: 1, createDate: '2025-01-01' },
      { warehouseID: 4, warehouseCode: 'KCD', warehouseName: '外仓', type: 'external', manager: '王五', status: 1, createDate: '2025-01-01' },
      { warehouseID: 5, warehouseCode: 'KCE', warehouseName: '待处理仓', type: 'pending', manager: '赵六', status: 1, createDate: '2025-01-01' }
    ]
  },
  '/warehouse/1/inventory': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          inventoryID: 1,
          warehouseID: 1,
          productID: 1,
          productCode: 'CP202505200001',
          productName: 'A型配件',
          unit: '个',
          spec: '直径10mm',
          quantity: 100,
          unitCost: 50,
          location: 'A-01-01',
          updateDate: '2025-05-20 10:00:00'
        },
        {
          inventoryID: 2,
          warehouseID: 1,
          productID: 2,
          productCode: 'CP202505200002',
          productName: 'B型组件',
          unit: '套',
          spec: '尺寸20x30cm',
          quantity: 50,
          unitCost: 100,
          location: 'A-01-02',
          updateDate: '2025-05-20 10:00:00'
        }
      ],
      total: 2
    }
  },
  '/warehouse/2/inventory': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          inventoryID: 3,
          warehouseID: 2,
          warehouseName: '成品仓',
          productID: 1,
          productCode: 'CP202505200001',
          productName: 'A型配件',
          unit: '个',
          spec: '直径10mm',
          quantity: 200,
          unitCost: 50,
          location: 'B-01-01',
          updateDate: '2025-05-20 10:00:00'
        },
        {
          inventoryID: 8,
          warehouseID: 2,
          warehouseName: '成品仓',
          productID: 2,
          productCode: 'CP202505200002',
          productName: 'B型组件',
          unit: '套',
          spec: '尺寸20x30cm',
          quantity: 50,
          unitCost: 100,
          location: 'B-01-02',
          updateDate: '2025-05-20 10:00:00'
        },
        {
          inventoryID: 9,
          warehouseID: 2,
          warehouseName: '成品仓',
          productID: 3,
          productCode: 'CP202505200003',
          productName: 'C型零件',
          unit: '件',
          spec: '长度5cm',
          quantity: 200,
          unitCost: 25,
          location: 'B-01-03',
          updateDate: '2025-05-20 10:00:00'
        }
      ],
      total: 3
    }
  },
  '/warehouse/3/inventory': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          inventoryID: 4,
          warehouseID: 3,
          productID: 4,
          productCode: 'YL202505200001',
          productName: '塑料颗粒',
          unit: 'kg',
          spec: 'PE-100',
          quantity: 500,
          unitCost: 15.5,
          location: 'C-01-01',
          updateDate: '2025-05-20 10:00:00'
        },
        {
          inventoryID: 5,
          warehouseID: 3,
          productID: 5,
          productCode: 'YL202505200002',
          productName: '金属棒',
          unit: '根',
          spec: '直径50mm',
          quantity: 200,
          unitCost: 25,
          location: 'C-01-02',
          updateDate: '2025-05-20 10:00:00'
        }
      ],
      total: 2
    }
  },
  '/warehouse/4/inventory': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          inventoryID: 6,
          warehouseID: 4,
          productID: 1,
          productCode: 'CP202505200001',
          productName: 'A型配件',
          unit: '个',
          spec: '直径10mm',
          quantity: 50,
          unitCost: 50,
          location: 'D-01-01',
          updateDate: '2025-05-20 10:00:00'
        }
      ],
      total: 1
    }
  },
  '/warehouse/5/inventory': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          inventoryID: 7,
          warehouseID: 5,
          productID: 3,
          productCode: 'CP202505200003',
          productName: 'C型零件',
          unit: '件',
          spec: '长度5cm',
          quantity: 20,
          unitCost: 25,
          location: 'E-01-01',
          updateDate: '2025-05-20 10:00:00'
        }
      ],
      total: 1
    }
  },
  '/warehouse/transfers': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          transferID: 1,
          transferNo: 'TP202505200001',
          fromWarehouseID: 1,
          fromWarehouseName: '车间仓 (KCA)',
          toWarehouseID: 2,
          toWarehouseName: '成品仓 (KCB)',
          transferDate: '2025-05-20',
          status: 'pending',
          creator: '陈立国',
          createDate: '2025-05-20',
          updateDate: '2025-05-20',
          remark: '生产调拨'
        },
        {
          transferID: 2,
          transferNo: 'TP202505190001',
          fromWarehouseID: 2,
          fromWarehouseName: '成品仓 (KCB)',
          toWarehouseID: 4,
          toWarehouseName: '外仓 (KCD)',
          transferDate: '2025-05-19',
          status: 'completed',
          creator: '陈立国',
          createDate: '2025-05-19',
          updateDate: '2025-05-19',
          remark: '外协加工调出'
        },
        {
          transferID: 3,
          transferNo: 'TP202505180001',
          fromWarehouseID: 3,
          fromWarehouseName: '材料仓 (KCC)',
          toWarehouseID: 1,
          toWarehouseName: '车间仓 (KCA)',
          transferDate: '2025-05-18',
          status: 'completed',
          creator: '张三',
          createDate: '2025-05-18',
          updateDate: '2025-05-18',
          remark: '补充生产原料'
        }
      ],
      total: 3
    }
  },
  '/warehouse/transfers/1': {
    code: 200,
    message: 'success',
    data: {
      transferID: 1,
      transferNo: 'TP202505200001',
      fromWarehouseID: 1,
      fromWarehouseName: '车间仓 (KCA)',
      toWarehouseID: 2,
      toWarehouseName: '成品仓 (KCB)',
      transferDate: '2025-05-20',
      status: 'pending',
      creator: '陈立国',
      createDate: '2025-05-20',
      updateDate: '2025-05-20',
      remark: '生产调拨'
    }
  },
  '/warehouse/transfers/2': {
    code: 200,
    message: 'success',
    data: {
      transferID: 2,
      transferNo: 'TP202505190001',
      fromWarehouseID: 2,
      fromWarehouseName: '成品仓 (KCB)',
      toWarehouseID: 4,
      toWarehouseName: '外仓 (KCD)',
      transferDate: '2025-05-19',
      status: 'completed',
      creator: '陈立国',
      createDate: '2025-05-19',
      updateDate: '2025-05-19',
      remark: '外协加工调出'
    }
  },
  '/warehouse/transfers/3': {
    code: 200,
    message: 'success',
    data: {
      transferID: 3,
      transferNo: 'TP202505180001',
      fromWarehouseID: 3,
      fromWarehouseName: '材料仓 (KCC)',
      toWarehouseID: 1,
      toWarehouseName: '车间仓 (KCA)',
      transferDate: '2025-05-18',
      status: 'completed',
      creator: '张三',
      createDate: '2025-05-18',
      updateDate: '2025-05-18',
      remark: '补充生产原料'
    }
  },
  '/warehouse/transfers/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        transferID: 1,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 10
      },
      {
        detailID: 2,
        transferID: 1,
        productID: 2,
        productName: 'B型组件',
        unit: '套',
        quantity: 5
      }
    ]
  },
  '/warehouse/transfers/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 3,
        transferID: 2,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 20
      }
    ]
  },
  '/warehouse/transfers/3/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 4,
        transferID: 3,
        productID: 1,
        productName: '乳液',
        unit: 'kg',
        quantity: 100
      },
      {
        detailID: 5,
        transferID: 3,
        productID: 2,
        productName: '金属棒',
        unit: '根',
        quantity: 20
      }
    ]
  },
  '/warehouse/deliveries': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          deliveryID: 1,
          deliveryNo: 'FH202505200001',
          soID: 1,
          orderNo: 'XS202505200001',
          customerID: 1,
          customerName: '北京科技有限公司',
          deliveryDate: '2025-05-20',
          totalAmount: 2000,
          status: 'shipped',
          carrier: '顺丰速运',
          trackingNo: 'SF1234567890',
          creator: '陈立国',
          createDate: '2025-05-20'
        },
        {
          deliveryID: 2,
          deliveryNo: 'FH202505200002',
          soID: 1,
          orderNo: 'XS202505200001',
          customerID: 1,
          customerName: '北京科技有限公司',
          deliveryDate: '2025-05-21',
          totalAmount: 3000,
          status: 'pending',
          carrier: '',
          trackingNo: '',
          creator: '陈立国',
          createDate: '2025-05-21'
        },
        {
          deliveryID: 3,
          deliveryNo: 'FH202505190001',
          soID: 3,
          orderNo: 'XS202505150003',
          customerID: 3,
          customerName: '广州电子科技',
          deliveryDate: '2025-05-19',
          totalAmount: 5000,
          status: 'shipped',
          carrier: '中通快递',
          trackingNo: 'ZTO9876543210',
          creator: '陈立国',
          createDate: '2025-05-19'
        }
      ],
      total: 3
    }
  },
  '/warehouse/deliveries/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        deliveryID: 1,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 20,
        price: 100,
        amount: 2000
      }
    ]
  },
  '/warehouse/deliveries/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 2,
        deliveryID: 2,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 30,
        price: 100,
        amount: 3000
      }
    ]
  },
  '/warehouse/deliveries/3/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 3,
        deliveryID: 3,
        productID: 3,
        productName: 'C型零件',
        unit: '件',
        quantity: 100,
        price: 50,
        amount: 5000
      }
    ]
  },
  '/warehouse/picks': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          pickID: 1,
          pickNo: 'LL202505200001',
          productionPlanID: 1,
          planNo: 'SC202505200001',
          warehouseID: 3,
          warehouseName: '材料仓',
          pickDate: '2025-05-20',
          status: 'pending',
          picker: '张三',
          createDate: '2025-05-20'
        },
        {
          pickID: 2,
          pickNo: 'LL202505190001',
          productionPlanID: 1,
          planNo: 'SC202505200001',
          warehouseID: 3,
          warehouseName: '材料仓',
          pickDate: '2025-05-19',
          status: 'completed',
          picker: '李四',
          createDate: '2025-05-19'
        },
        {
          pickID: 3,
          pickNo: 'LL202505180001',
          productionPlanID: 2,
          planNo: 'SC202505200002',
          warehouseID: 3,
          warehouseName: '材料仓',
          pickDate: '2025-05-18',
          status: 'completed',
          picker: '王五',
          createDate: '2025-05-18'
        }
      ],
      total: 3
    }
  },
  '/warehouse/picks/1': {
    code: 200,
    message: 'success',
    data: {
      pickID: 1,
      pickNo: 'LL202505200001',
      productionPlanID: 1,
      planNo: 'SC202505200001',
      warehouseID: 3,
      warehouseName: '材料仓',
      pickDate: '2025-05-20',
      status: 'pending',
      picker: '张三',
      remark: '第一批领料'
    }
  },
  '/warehouse/picks/2': {
    code: 200,
    message: 'success',
    data: {
      pickID: 2,
      pickNo: 'LL202505190001',
      productionPlanID: 1,
      planNo: 'SC202505200001',
      warehouseID: 3,
      warehouseName: '材料仓',
      pickDate: '2025-05-19',
      status: 'completed',
      picker: '李四',
      remark: ''
    }
  },
  '/warehouse/picks/3': {
    code: 200,
    message: 'success',
    data: {
      pickID: 3,
      pickNo: 'LL202505180001',
      productionPlanID: 2,
      planNo: 'SC202505200002',
      warehouseID: 3,
      warehouseName: '材料仓',
      pickDate: '2025-05-18',
      status: 'completed',
      picker: '王五',
      remark: ''
    }
  },
  '/warehouse/picks/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        pickID: 1,
        materialID: 1,
        materialName: '乳液',
        unit: 'kg',
        quantity: 20
      },
      {
        detailID: 2,
        pickID: 1,
        materialID: 2,
        materialName: '金属棒',
        unit: '根',
        quantity: 10
      }
    ]
  },
  '/warehouse/picks/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 3,
        pickID: 2,
        materialID: 1,
        materialName: '乳液',
        unit: 'kg',
        quantity: 20
      },
      {
        detailID: 4,
        pickID: 2,
        materialID: 2,
        materialName: '金属棒',
        unit: '根',
        quantity: 10
      },
      {
        detailID: 5,
        pickID: 2,
        materialID: 3,
        materialName: '螺丝螺母',
        unit: '套',
        quantity: 50
      }
    ]
  },
  '/warehouse/picks/3/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 6,
        pickID: 3,
        materialID: 1,
        materialName: '乳液',
        unit: 'kg',
        quantity: 25
      },
      {
        detailID: 7,
        pickID: 3,
        materialID: 4,
        materialName: '橡胶垫片',
        unit: '片',
        quantity: 100
      }
    ]
  },
  '/warehouse/returns': {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          returnID: 1,
          returnNo: 'TH202505200001',
          sourceType: 1,
          sourceID: 1,
          sourceNo: 'XS202505200001',
          customerID: 1,
          customerName: '北京科技有限公司',
          warehouseID: 5,
          warehouseName: '待处理仓',
          returnDate: '2025-05-20',
          totalAmount: 1000,
          status: 'pending',
          creator: '陈立国',
          createDate: '2025-05-20'
        },
        {
          returnID: 2,
          returnNo: 'TH202505190001',
          sourceType: 2,
          sourceID: null,
          sourceNo: '',
          customerID: 2,
          customerName: '上海商贸集团',
          warehouseID: 5,
          warehouseName: '待处理仓',
          returnDate: '2025-05-19',
          totalAmount: 800,
          status: 'completed',
          creator: '陈立国',
          createDate: '2025-05-19'
        }
      ],
      total: 2
    }
  },
  '/warehouse/returns/1': {
    code: 200,
    message: 'success',
    data: {
      returnID: 1,
      returnNo: 'TH202505200001',
      sourceType: 1,
      sourceID: 1,
      sourceNo: 'XS202505200001',
      customerID: 1,
      customerName: '北京科技有限公司',
      warehouseID: 5,
      warehouseName: '待处理仓',
      returnDate: '2025-05-20',
      totalAmount: 1000,
      status: 'pending',
      creator: '陈立国',
      createDate: '2025-05-20',
      remark: '质量问题退货'
    }
  },
  '/warehouse/returns/2': {
    code: 200,
    message: 'success',
    data: {
      returnID: 2,
      returnNo: 'TH202505190001',
      sourceType: 2,
      sourceID: null,
      sourceNo: '',
      customerID: 2,
      customerName: '上海商贸集团',
      warehouseID: 5,
      warehouseName: '待处理仓',
      returnDate: '2025-05-19',
      totalAmount: 800,
      status: 'completed',
      creator: '陈立国',
      createDate: '2025-05-19',
      remark: '直接退货'
    }
  },
  '/warehouse/returns/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        returnID: 1,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 10,
        price: 100,
        amount: 1000
      }
    ]
  },
  '/warehouse/returns/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 2,
        returnID: 2,
        productID: 2,
        productName: 'B型组件',
        unit: '套',
        quantity: 4,
        price: 200,
        amount: 800
      }
    ]
  },
  '/warehouse/returns/sales-orders': {
    code: 200,
    message: 'success',
    data: [
      {
        soID: 1,
        orderNo: 'XS202505200001',
        customerID: 1,
        customerName: '北京科技有限公司',
        orderDate: '2025-05-20',
        totalAmount: 5000,
        status: 'approved'
      },
      {
        soID: 2,
        orderNo: 'XS202505200002',
        customerID: 2,
        customerName: '上海商贸集团',
        orderDate: '2025-05-18',
        totalAmount: 8000,
        status: 'approved'
      },
      {
        soID: 3,
        orderNo: 'XS202505150003',
        customerID: 3,
        customerName: '广州电子科技',
        orderDate: '2025-05-15',
        totalAmount: 12000,
        status: 'producing'
      }
    ]
  },
  '/warehouse/returns/sales-orders/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        soID: 1,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 50,
        deliveredQuantity: 20,
        price: 100,
        amount: 5000
      }
    ]
  },
  '/warehouse/returns/sales-orders/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 2,
        soID: 2,
        productID: 2,
        productName: 'B型组件',
        unit: '套',
        quantity: 40,
        deliveredQuantity: 0,
        price: 200,
        amount: 8000
      }
    ]
  },
  '/warehouse/returns/sales-orders/3/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 3,
        soID: 3,
        productID: 3,
        productName: 'C型零件',
        unit: '件',
        quantity: 240,
        deliveredQuantity: 100,
        price: 50,
        amount: 12000
      }
    ]
  },
  '/warehouse/deliveries/sales-orders': {
    code: 200,
    message: 'success',
    data: [
      {
        soID: 1,
        orderNo: 'XS202505200001',
        customerID: 1,
        customerName: '北京科技有限公司',
        orderDate: '2025-05-20',
        totalAmount: 5000,
        status: 'approved'
      },
      {
        soID: 2,
        orderNo: 'XS202505200002',
        customerID: 2,
        customerName: '上海商贸集团',
        orderDate: '2025-05-18',
        totalAmount: 8000,
        status: 'approved'
      },
      {
        soID: 3,
        orderNo: 'XS202505200003',
        customerID: 3,
        customerName: '广州电子科技',
        orderDate: '2025-05-15',
        totalAmount: 12000,
        status: 'producing'
      }
    ]
  },
  '/warehouse/deliveries/sales-orders/1/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 1,
        soID: 1,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 50,
        deliveredQuantity: 20,
        price: 100,
        amount: 5000
      }
    ]
  },
  '/warehouse/deliveries/sales-orders/2/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 2,
        soID: 2,
        productID: 2,
        productName: 'B型组件',
        unit: '套',
        quantity: 40,
        deliveredQuantity: 0,
        price: 200,
        amount: 8000
      }
    ]
  },
  '/warehouse/deliveries/sales-orders/3/details': {
    code: 200,
    message: 'success',
    data: [
      {
        detailID: 3,
        soID: 3,
        productID: 3,
        productName: 'C型零件',
        unit: '件',
        quantity: 240,
        deliveredQuantity: 100,
        price: 50,
        amount: 12000
      }
    ]
  },
  '/warehouse/inventory/in': {
    code: 200,
    message: 'success',
    data: {
      inventoryId: 100,
      warehouseId: 2,
      warehouseName: '成品仓',
      productId: 1,
      productName: 'A型配件',
      quantity: 100,
      unitCost: 0,
      remark: '生产计划完成入库',
      updateDate: new Date().toLocaleString()
    }
  },
  '/warehouse/picks/production-plans': {
    code: 200,
    message: 'success',
    data: [
      {
        productionPlanID: 1,
        planNo: 'SC202505200001',
        productID: 1,
        productName: 'A型配件',
        plannedQuantity: 100,
        status: 'producing'
      },
      {
        productionPlanID: 2,
        planNo: 'SC202505200002',
        productID: 2,
        productName: 'B型组件',
        plannedQuantity: 50,
        status: 'pending'
      },
      {
        productionPlanID: 3,
        planNo: 'SC202505150001',
        productID: 3,
        productName: 'C型零件',
        plannedQuantity: 200,
        status: 'completed'
      }
    ]
  },
  '/warehouse/picks/production-plans/1/recipe-materials': {
    code: 200,
    message: 'success',
    data: [
      {
        materialID: 1,
        materialCode: 'MA292',
        materialName: '乳液',
        unit: 'kg',
        recipeQuantity: 50
      },
      {
        materialID: 2,
        materialCode: 'YL202505200002',
        materialName: '金属棒',
        unit: '根',
        recipeQuantity: 30
      },
      {
        materialID: 3,
        materialCode: 'YL202505200003',
        materialName: '螺丝螺母',
        unit: '套',
        recipeQuantity: 100
      }
    ]
  },
  '/warehouse/picks/production-plans/1/pick-quantities': {
    code: 200,
    message: 'success',
    data: [
      {
        materialID: 1,
        totalRequired: 50,
        totalPicked: 20,
        remainingQuantity: 30
      },
      {
        materialID: 2,
        totalRequired: 30,
        totalPicked: 10,
        remainingQuantity: 20
      },
      {
        materialID: 3,
        totalRequired: 100,
        totalPicked: 0,
        remainingQuantity: 100
      }
    ]
  },
  '/warehouse/picks/production-plans/2/recipe-materials': {
    code: 200,
    message: 'success',
    data: [
      {
        materialID: 1,
        materialCode: 'MA292',
        materialName: '乳液',
        unit: 'kg',
        recipeQuantity: 25
      },
      {
        materialID: 4,
        materialCode: 'YL202505200004',
        materialName: '橡胶垫片',
        unit: '片',
        recipeQuantity: 200
      }
    ]
  },
  '/warehouse/picks/production-plans/2/pick-quantities': {
    code: 200,
    message: 'success',
    data: []
  },
  '/warehouse/picks/production-plans/3/recipe-materials': {
    code: 200,
    message: 'success',
    data: [
      {
        materialID: 1,
        materialCode: 'MA292',
        materialName: '乳液',
        unit: 'kg',
        recipeQuantity: 80
      }
    ]
  },
  '/warehouse/picks/production-plans/3/pick-quantities': {
    code: 200,
    message: 'success',
    data: [
      {
        materialID: 1,
        totalRequired: 80,
        totalPicked: 80,
        remainingQuantity: 0
      }
    ]
  },
  '/finance/receivables/POST': {
    code: 200,
    message: 'success',
    data: {
      receivableID: 4,
      receivableNo: 'YS202505210001',
      customerID: 1,
      customerName: '北京科技有限公司',
      salesOrderID: 1,
      salesOrderNo: 'XS202505200001',
      totalAmount: 5000.00,
      receivedAmount: 0.00,
      pendingAmount: 5000.00,
      status: 'pending',
      dueDate: '2025-05-30',
      creator: '陈立国',
      createDate: '2025-05-21'
    }
  },
  '/finance/receivables/:id/verify': {
    code: 200,
    message: 'success',
    data: {
      receivableID: 1,
      receivedAmount: 3000.00,
      pendingAmount: 2000.00,
      status: 'partial',
      paymentDate: '2025-05-21',
      paymentMethod: 'transfer'
    }
  },
  '/finance/payables/POST': {
    code: 200,
    message: 'success',
    data: {
      payableID: 100,
      payableNo: 'YF202505210001',
      supplierID: 1,
      supplierName: '深圳材料厂',
      purchaseOrderID: 1,
      purchaseOrderNo: 'CG202505200001',
      totalAmount: 5000.00,
      paidAmount: 0.00,
      pendingAmount: 5000.00,
      status: 'pending',
      dueDate: '',
      creator: '陈立国',
      createDate: new Date().toISOString().split('T')[0]
    }
  },
  '/finance/payables/:id/verify': {
    code: 200,
    message: 'success',
    data: {
      payableID: 1,
      paidAmount: 3000.00,
      pendingAmount: 2000.00,
      status: 'partial'
    }
  },
  '/purchase/orders/:id/receive': {
    code: 200,
    message: 'success',
    data: {
      poID: 1,
      poNo: 'CG202505200001',
      status: 'received'
    }
  }
}

request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 直接在请求前检查Mock数据
    let url = config.url || ''
    if (url.startsWith('/api')) {
      url = url.substring(4)
    }
    const mockKey = Object.keys(mockData).find(key => url.includes(key))
    
    if (mockKey) {
      console.log('使用Mock数据:', mockKey)
      // 直接返回Mock数据作为响应
      // 我们将通过adapter或者修改请求的方式来处理，但先保留简单版本
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const res = response.data
    
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      
      if (res.code === 401) {
        localStorage.removeItem('erp_token')
        router.push('/login')
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  (error) => {
    console.error('请求错误:', error)
    
    // 错误时使用Mock数据
    let url = error.config?.url || ''
    if (url.startsWith('/api')) {
      url = url.substring(4)
    }
    const mockKey = Object.keys(mockData).find(key => url.includes(key))
    
    if (mockKey) {
      console.log('使用Mock数据:', mockKey)
      return Promise.resolve(mockData[mockKey])
    }
    
    if (error.response) {
      if (error.response.status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        localStorage.removeItem('erp_token')
        router.push('/login')
      } else if (error.response.status === 403) {
        ElMessage.error('权限不足')
      } else {
        ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else {
      ElMessage.error('网络错误')
    }
    
    return Promise.reject(error)
  }
)

export default request
