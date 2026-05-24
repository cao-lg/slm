import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import QuotationList from '@/views/sales/QuotationList.vue'
import SalesOrderList from '@/views/sales/SalesOrderList.vue'
import {
  quotations,
  quotationDetails,
  salesOrders,
  salesOrderDetails,
  customers,
  products
} from '@/__tests__/data'
import * as salesApi from '@/api/sales'
import * as productApi from '@/api/product'
import * as financeApi from '@/api/finance'
import { ElMessageBox } from 'element-plus'

vi.mock('@/api/sales', () => ({
  getQuotationList: vi.fn(),
  getQuotationDetails: vi.fn(),
  addQuotation: vi.fn(),
  updateQuotation: vi.fn(),
  deleteQuotation: vi.fn(),
  updateQuotationStatus: vi.fn(),
  convertQuotationToOrder: vi.fn(),
  getCustomerList: vi.fn(),
  getQuotation: vi.fn(),
  getSalesOrderList: vi.fn(),
  getSalesOrderDetails: vi.fn(),
  addSalesOrder: vi.fn(),
  updateSalesOrder: vi.fn(),
  deleteSalesOrder: vi.fn(),
  updateSalesOrderStatus: vi.fn()
}))

vi.mock('@/api/product', () => ({
  getProductList: vi.fn()
}))

vi.mock('@/api/finance', () => ({
  addReceivable: vi.fn()
}))

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessageBox: {
      confirm: vi.fn().mockResolvedValue(true)
    }
  }
})

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/sales/quotation/:id', component: { template: '<div>Quotation Detail</div>' } },
    { path: '/sales/order', component: { template: '<div>Sales Order</div>' } },
    { path: '/sales/order/:id', component: { template: '<div>Order Detail</div>' } }
  ]
})

describe('销售流程测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    vi.spyOn(salesApi, 'getQuotationList').mockResolvedValue({
      data: { list: quotations, total: quotations.length }
    })
    vi.spyOn(salesApi, 'getCustomerList').mockResolvedValue({
      data: { list: customers, total: customers.length }
    })
    vi.spyOn(productApi, 'getProductList').mockResolvedValue({
      data: { list: products, total: products.length }
    })
  })

  describe('报价单组件测试', () => {
    it('应该能正常挂载报价单组件', () => {
      const wrapper = mount(QuotationList, {
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('应该能正确显示报价单数据', async () => {
      const wrapper = mount(QuotationList, {
        global: {
          plugins: [router]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(salesApi.getQuotationList).toHaveBeenCalled()
    })

    it('应该有新增报价单按钮', () => {
      const wrapper = mount(QuotationList, {
        global: {
          plugins: [router]
        }
      })
      
      const addButton = wrapper.find('button')
      expect(addButton.exists()).toBe(true)
    })

    it('应该有搜索功能', () => {
      const wrapper = mount(QuotationList, {
        global: {
          plugins: [router]
        }
      })
      
      const searchForm = wrapper.find('.search-form')
      expect(searchForm.exists()).toBe(true)
    })
  })

  describe('销售订单组件测试', () => {
    beforeEach(() => {
      vi.spyOn(salesApi, 'getSalesOrderList').mockResolvedValue({
        data: { list: salesOrders, total: salesOrders.length }
      })
    })

    it('应该能正常挂载销售订单组件', () => {
      const wrapper = mount(SalesOrderList, {
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('应该能正确显示销售订单数据', async () => {
      const wrapper = mount(SalesOrderList, {
        global: {
          plugins: [router]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(salesApi.getSalesOrderList).toHaveBeenCalled()
    })

    it('应该有新增订单按钮', () => {
      const wrapper = mount(SalesOrderList, {
        global: {
          plugins: [router]
        }
      })
      
      const addButton = wrapper.find('button')
      expect(addButton.exists()).toBe(true)
    })
  })

  describe('报价单转订单流程测试', () => {
    it('应该能将已接受的报价单转为订单', async () => {
      const acceptedQuotation = quotations.find(q => q.status === 'accepted')!
      
      vi.spyOn(salesApi, 'convertQuotationToOrder').mockResolvedValue({
        data: { soID: 100 }
      })
      
      const pushSpy = vi.spyOn(router, 'push')
      
      const wrapper = mount(QuotationList, {
        global: {
          plugins: [router]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      wrapper.vm.currentRow = acceptedQuotation
      await wrapper.vm.handleConvertToOrder(acceptedQuotation)
      
      expect(salesApi.convertQuotationToOrder).toHaveBeenCalledWith(acceptedQuotation.quotationID!)
    })

    it('报价单转订单后应该跳转到销售订单页面', async () => {
      const acceptedQuotation = quotations.find(q => q.status === 'accepted')!
      
      vi.spyOn(salesApi, 'convertQuotationToOrder').mockResolvedValue({
        data: { soID: 100 }
      })
      
      const pushSpy = vi.spyOn(router, 'push')
      
      const wrapper = mount(QuotationList, {
        global: {
          plugins: [router]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      wrapper.vm.currentRow = acceptedQuotation
      await wrapper.vm.handleConvertToOrder(acceptedQuotation)
      
      expect(pushSpy).toHaveBeenCalled()
    })
  })

  describe('订单状态流转测试', () => {
    it('应该能审核待审核订单', async () => {
      const pendingOrder = salesOrders.find(o => o.status === 'pending')!
      
      vi.spyOn(salesApi, 'updateSalesOrderStatus').mockResolvedValue({})
      
      const wrapper = mount(SalesOrderList, {
        global: {
          plugins: [router]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await wrapper.vm.handleApprove(pendingOrder)
      
      expect(salesApi.updateSalesOrderStatus).toHaveBeenCalledWith(pendingOrder.soID!, 'approved')
    })

    it('应该能将已审核订单转为生产中', async () => {
      const approvedOrder = { ...salesOrders[0], status: 'approved' }
      
      vi.spyOn(salesApi, 'updateSalesOrderStatus').mockResolvedValue({})
      
      const wrapper = mount(SalesOrderList, {
        global: {
          plugins: [router]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await wrapper.vm.handleProduce(approvedOrder)
      
      expect(salesApi.updateSalesOrderStatus).toHaveBeenCalledWith(approvedOrder.soID!, 'producing')
    })

    it('应该能将生产中订单标记为已发货', async () => {
      const producingOrder = { ...salesOrders[0], status: 'producing' }
      
      vi.spyOn(salesApi, 'updateSalesOrderStatus').mockResolvedValue({})
      
      const wrapper = mount(SalesOrderList, {
        global: {
          plugins: [router]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await wrapper.vm.handleShip(producingOrder)
      
      expect(salesApi.updateSalesOrderStatus).toHaveBeenCalledWith(producingOrder.soID!, 'shipped')
    })

    it('应该能将已发货订单标记为完成并生成应收款', async () => {
      const shippedOrder = salesOrders.find(o => o.status === 'shipped')!
      
      vi.spyOn(salesApi, 'updateSalesOrderStatus').mockResolvedValue({})
      vi.spyOn(financeApi, 'addReceivable').mockResolvedValue({})
      
      const wrapper = mount(SalesOrderList, {
        global: {
          plugins: [router]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await wrapper.vm.handleComplete(shippedOrder)
      
      expect(salesApi.updateSalesOrderStatus).toHaveBeenCalledWith(shippedOrder.soID!, 'completed')
      expect(financeApi.addReceivable).toHaveBeenCalled()
    })
  })
})
