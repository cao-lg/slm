import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import ReceivableList from '@/views/finance/ReceivableList.vue'
import PayableList from '@/views/finance/PayableList.vue'
import { receivables } from '@/__tests__/data/receivables'
import { payables } from '@/__tests__/data/payables'
import * as financeApi from '@/api/finance'
import * as salesApi from '@/api/sales'
import * as purchaseApi from '@/api/purchase'

vi.mock('@/api/finance', () => ({
  getReceivableList: vi.fn(),
  addReceivable: vi.fn(),
  deleteReceivable: vi.fn(),
  verifyReceivable: vi.fn(),
  getPayableList: vi.fn(),
  addPayable: vi.fn(),
  deletePayable: vi.fn(),
  verifyPayable: vi.fn()
}))

vi.mock('@/api/sales', () => ({
  getCustomerList: vi.fn(),
  getSalesOrderList: vi.fn()
}))

vi.mock('@/api/purchase', () => ({
  getSupplierList: vi.fn(),
  getPurchaseOrderList: vi.fn()
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } }
  ]
})

describe('财务核销测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    vi.mocked(financeApi.getReceivableList).mockResolvedValue({
      data: {
        list: receivables,
        total: receivables.length
      }
    })
    
    vi.mocked(financeApi.getPayableList).mockResolvedValue({
      data: {
        list: payables,
        total: payables.length
      }
    })
    
    vi.mocked(salesApi.getCustomerList).mockResolvedValue({
      data: {
        list: [],
        total: 0
      }
    })
    
    vi.mocked(salesApi.getSalesOrderList).mockResolvedValue({
      data: {
        list: [],
        total: 0
      }
    })
    
    vi.mocked(purchaseApi.getSupplierList).mockResolvedValue({
      data: {
        list: [],
        total: 0
      }
    })
    
    vi.mocked(purchaseApi.getPurchaseOrderList).mockResolvedValue({
      data: {
        list: [],
        total: 0
      }
    })
  })

  describe('应收款管理测试', () => {
    it('应收款列表组件能正常加载', async () => {
      const wrapper = mount(ReceivableList, {
        global: {
          plugins: [router, ElementPlus]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('应收款管理')
    })

    it('应收款数据正确显示', async () => {
      const wrapper = mount(ReceivableList, {
        global: {
          plugins: [router, ElementPlus]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(financeApi.getReceivableList).toHaveBeenCalled()
      expect(wrapper.text()).toContain('AR202401001')
      expect(wrapper.text()).toContain('北京大华科技有限公司')
    })

    it('应收款核销功能正常工作', async () => {
      vi.mocked(financeApi.verifyReceivable).mockResolvedValue({})
      
      const wrapper = mount(ReceivableList, {
        global: {
          plugins: [router, ElementPlus]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const testReceivable = receivables.find(r => r.receivableID === 1)
      expect(testReceivable).toBeDefined()
      
      wrapper.vm.handleVerify(testReceivable!)
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.verifyDialogVisible).toBe(true)
      expect(wrapper.vm.verifyForm.receivableID).toBe(testReceivable?.receivableID)
      expect(wrapper.vm.verifyForm.paymentDate).toBe(new Date().toISOString().split('T')[0])
      expect(wrapper.vm.verifyForm.paymentMethod).toBe('transfer')
    })

    it('验证应收款核销时 paymentDate 和 paymentMethod 字段保存', async () => {
      const testReceivable = receivables.find(r => r.receivableID === 1)!
      const testPaymentDate = '2024-02-15'
      const testPaymentMethod = 'cash'
      
      vi.mocked(financeApi.verifyReceivable).mockResolvedValue({})
      
      const wrapper = mount(ReceivableList, {
        global: {
          plugins: [router, ElementPlus]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      wrapper.vm.handleVerify(testReceivable)
      await wrapper.vm.$nextTick()
      
      wrapper.vm.verifyForm.amount = 30000
      wrapper.vm.verifyForm.paymentDate = testPaymentDate
      wrapper.vm.verifyForm.paymentMethod = testPaymentMethod
      
      wrapper.vm.verifyFormRef = {
        validate: vi.fn().mockResolvedValue(true)
      }
      
      await wrapper.vm.handleVerifySubmit()
      
      expect(financeApi.verifyReceivable).toHaveBeenCalledWith(
        testReceivable.receivableID!,
        30000,
        testPaymentDate,
        testPaymentMethod,
        ''
      )
    })
  })

  describe('应付款管理测试', () => {
    it('应付款列表组件能正常加载', async () => {
      const wrapper = mount(PayableList, {
        global: {
          plugins: [router, ElementPlus]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('应付款管理')
    })

    it('应付款数据正确显示', async () => {
      const wrapper = mount(PayableList, {
        global: {
          plugins: [router, ElementPlus]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(financeApi.getPayableList).toHaveBeenCalled()
      expect(wrapper.text()).toContain('AP202401001')
      expect(wrapper.text()).toContain('深圳电子元器件厂')
    })

    it('应付款核销功能正常工作', async () => {
      vi.mocked(financeApi.verifyPayable).mockResolvedValue({})
      
      const wrapper = mount(PayableList, {
        global: {
          plugins: [router, ElementPlus]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const testPayable = payables.find(p => p.payableID === 2)
      expect(testPayable).toBeDefined()
      
      wrapper.vm.handleVerify(testPayable!)
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.verifyDialogVisible).toBe(true)
      expect(wrapper.vm.verifyForm.payableID).toBe(testPayable?.payableID)
      expect(wrapper.vm.verifyForm.paymentDate).toBe(new Date().toISOString().split('T')[0])
      expect(wrapper.vm.verifyForm.paymentMethod).toBe('transfer')
    })

    it('验证应付款核销时 paymentDate 和 paymentMethod 字段保存', async () => {
      const testPayable = payables.find(p => p.payableID === 2)!
      const testPaymentDate = '2024-02-20'
      const testPaymentMethod = 'check'
      
      vi.mocked(financeApi.verifyPayable).mockResolvedValue({})
      
      const wrapper = mount(PayableList, {
        global: {
          plugins: [router, ElementPlus]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      wrapper.vm.handleVerify(testPayable)
      await wrapper.vm.$nextTick()
      
      wrapper.vm.verifyForm.amount = 30000
      wrapper.vm.verifyForm.paymentDate = testPaymentDate
      wrapper.vm.verifyForm.paymentMethod = testPaymentMethod
      
      wrapper.vm.verifyFormRef = {
        validate: vi.fn().mockResolvedValue(true)
      }
      
      await wrapper.vm.handleVerifySubmit()
      
      expect(financeApi.verifyPayable).toHaveBeenCalledWith(
        testPayable.payableID!,
        30000,
        testPaymentDate,
        testPaymentMethod,
        ''
      )
    })
  })
})
