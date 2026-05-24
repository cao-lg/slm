import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import CustomerList from '@/views/sales/CustomerList.vue'
import { customers } from '@/__tests__/data/customers'
import * as salesApi from '@/api/sales'

vi.mock('@/api/sales', () => ({
  getCustomerList: vi.fn(),
  addCustomer: vi.fn(),
  updateCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
  getCustomer: vi.fn()
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { name: 'CustomerDetail', path: '/customer/:id', component: { template: '<div>Customer Detail</div>' } }
  ]
})

describe('CustomerList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(salesApi, 'getCustomerList').mockResolvedValue({
      data: {
        list: customers,
        total: customers.length
      }
    })
  })

  it('测试客户列表页面能正常加载', async () => {
    const wrapper = mount(CustomerList, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('测试客户数据显示', async () => {
    const wrapper = mount(CustomerList, {
      global: {
        plugins: [router]
      }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData.length).toBe(customers.length)
  })

  it('测试客户筛选功能', async () => {
    const wrapper = mount(CustomerList, {
      global: {
        plugins: [router]
      }
    })
    await wrapper.vm.$nextTick()
    
    wrapper.vm.searchForm.customerName = '北京'
    await wrapper.vm.handleSearch()
    
    expect(salesApi.getCustomerList).toHaveBeenCalled()
  })

  it('测试客户新增功能弹窗', async () => {
    const wrapper = mount(CustomerList, {
      global: {
        plugins: [router]
      }
    })
    await wrapper.vm.$nextTick()
    
    await wrapper.vm.handleAdd()
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.dialogTitle).toBe('新增客户')
  })

  it('测试客户编辑功能', async () => {
    const wrapper = mount(CustomerList, {
      global: {
        plugins: [router]
      }
    })
    await wrapper.vm.$nextTick()
    
    const testCustomer = customers[0]
    await wrapper.vm.handleEdit(testCustomer)
    
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('编辑客户')
    expect(wrapper.vm.formData.customerID).toBe(testCustomer.customerID)
    expect(wrapper.vm.formData.customerName).toBe(testCustomer.customerName)
  })
})
